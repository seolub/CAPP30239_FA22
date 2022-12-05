# Inequality in Chicago

The result of this project can be found in https://seolub.github.io/CAPP30239_FA22/project/index.html.

### Interest in this topic 
My interest in Public Policy stems from a broader interest in how policy can help address inequality issues. Choosing Chicago to explore inequality by community area apprears as a clear option for two reasons: I have lived in Chicago now for 4 years, and Chicago's inequality issues are that prominent that have made it to the [international press](https://www.economist.com/united-states/2019/10/10/a-ride-along-chicagos-red-line)


### Data
The file Final_data.csv contains data extracted from different data files from the Chicago data portal. The raw files can be found in the folder "/data". They python script that executes the ETL process is also saved in this folder. Data is provided by Chicago Public Schools, U.S. Census Bureau, and Illinois Department of Public Health (IDPH).

The data used for this project is from 2009 and 2010. For some metrics, we could have found more recent data. But in order to compare community areas at a similar time, I decided to use all metrics from a very similar time range.

Links: 

https://data.cityofchicago.org/Health-Human-Services/Census-Data-Selected-socioeconomic-indicators-in-C/kn9c-c2s2 https://data.cityofchicago.org/Health-Human-Services/Public-Health-Statistics-Births-and-birth-rates-in/4arr-givg https://data.cityofchicago.org/Health-Human-Services/Public-Health-Statistics-Infant-mortality-in-Chica/bfhr-4ckq https://data.cityofchicago.org/Health-Human-Services/Census-Data-Selected-socioeconomic-indicators-in-C/kn9c-c2s2 https://data.cityofchicago.org/Education/Chicago-Public-Schools-High-School-Progress-Report/2m8w-izji

### The story
Inequality in income per capita is associated to other types of inequalities that are related not only to wealth but also to life outcomes. For that it starts with a brief introduction to inequality, its issues, and explores how where you live has an impact on your opportunities and your outcomes. 

The work here presented is purely descriptive and it does not show causality. This work shows a relationship between the income per capita of the community area where you live and many life outcomes. However, this work has not proofed directions of causality.

### Ethical considerations
Some metrics are shown in a way that implicitly represent what is more desired. For example, everybody would agree that higher life expectancy is better, and that the higher the grade in the ACT test the better. However, some metrics are shown implyting that the lower the better (e.g., Teen Births and Crowded Housing). It could be argued that Teen Births are desirable, and that living with many people might be an equally well way to live (e.g, having all your loved ones in the same place).

### The charts
The first map was a no brainer to show disparities in income by neighborhood. The beeswarm graphs were a great option to display the distribution of community areas by different metrics keeping the colors that represent income from the first graph. Finall, the last visualization allows to explore better by metric and by neighborhood what it has been shown before.

### Coding Challenges
Learning Javascript, CSS, and HTML at the same time as D3 was challenging. The code could be cleaner and more efficient and I would like to spend more time in the future polishing this project.

### Sources
Some of the text has been developed using the new tool recently released [ChatGPT][https://chat.openai.com/chat]. It is incredible how you can give instructions about what you want and how AI can be so precise returning an output. Big chunks of code have come from [Tiffany France's Github](ttps://github.com/tiffanyfrance/CAPP30239_FA22), Observable, and the huge help of the TA Sandy Guberti-NG. Big thanks to her.