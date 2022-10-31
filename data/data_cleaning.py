import pandas as pd 
import os
import glob
import geojson
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

path = os.getcwd()

path += "\data"

csv_files = glob.glob(os.path.join(path, "*.csv"))

zipcode_comm_area = pd.read_excel(path + "\Community area and zip code equivalency.xlsx")

with open(path + "\Boundaries - Community Areas (current).geojson") as f:
    gj = geojson.load(f)

 
socioeconomicDF = pd.read_csv(csv_files[0])
schoolsDF = pd.read_csv(csv_files[1])
ph_teenbirthDF = pd.read_csv(csv_files[2])
ph_infantmortDF = pd.read_csv(csv_files[3])
ph_lifeexpectDF = pd.read_csv(csv_files[4])
ph_general = pd.read_csv(csv_files[5])


#socieconomic data wrangling
final = socioeconomicDF.drop(['PERCENT AGED UNDER 18 OR OVER 64'], axis=1)

#schoolsDF data wranglig
schoolsDF = schoolsDF.loc[:,['College Enrollment Rate Percentage 2013', 'Grade ACT Attainment Percentile Grade 11', 'ZIP Code', 'Latitude', 'Longitude']]

def check_community_area(lat, lon, gj):

    point = Point(lat, lon)

    for ca in gj['features']:
        area = ca['properties']['area_numbe']
        name = ca['properties']['community']

        tuples = list(map(tuple, ca['geometry']['coordinates'][0][0]))
        polygon = Polygon(tuples)

        if polygon.contains(point):
            return area

schoolsDF['Community Area'] = schoolsDF.apply(lambda x: check_community_area(x['Latitude'], x['Longitude'], gj), axis = 1)

schoolsDF = schoolsDF.loc[:,['Community Area', 'Grade ACT Attainment Percentile Grade 11']].groupby('Community Area').agg(lambda g: g.mean(skipna=True))

final = final.drop(77,) #remove Chicago
final['Community Area Number'] = final['Community Area Number'].astype(int).astype(str)

final = final.merge(schoolsDF, left_on='Community Area Number', right_on='Community Area', how='left')

final['Community Area Number'] = final['Community Area Number'].astype(int)

#teenbirths
final = final.merge(ph_teenbirthDF.loc[:,['Community Area Number','Teen Births 2009']], left_on='Community Area Number', right_on='Community Area Number', how='left')

#infant mortality
final = final.merge(ph_infantmortDF.loc[:,['Community Area','Average Infant Mortality Rate 2005 - 2009']], left_on='Community Area Number', right_on='Community Area', how='left')

#life expectancy
final = final.merge(ph_lifeexpectDF.loc[:,['Community Area Number','2010 Life Expectancy']], left_on='Community Area Number', right_on='Community Area Number', how='left')

#general
ph_general = ph_general.loc[:, ['Community Area', 'Assault (Homicide)', 'Below Poverty Level','Per Capita Income','No High School Diploma', 'Unemployment']]

final = final.merge(ph_general, left_on='Community Area Number', right_on='Community Area', how='left')
