# import libraries
import re
import json
import requests
from bs4 import BeautifulSoup

# specify the url
# QUOTE_PAGE = 'http://catalog.csuchico.edu/viewer/search/courses.aspx?cycle=18&subject=CSCI&keywords=&psize=00'
QUOTE_PAGE = 'http://catalog.csuchico.edu/viewer/18/CSCI/CSCINONEBS.html'

# query website and return the html to the variable 'page'
PAGE = requests.get(QUOTE_PAGE)

# parse the html using beautiful soup and store the variable in `soup`
SOUP = BeautifulSoup(PAGE.text, 'html.parser')

COURSE_INFO = {}

# Take ut the <div> of the name and get its value
for course in SOUP.find_all('tr'):
    if course.get('class') is not None:
        # print course.contents[0].text.strip() ,
        COURSE_TITLE = course.contents[0].text.strip()
        COURSE_INFO[COURSE_TITLE] = []
        if "coursePrereq" in str(course.find_next('span').get('class')):
            DESC = course.find_next('span').text,
            PRE_REQS = re.findall(r'[A-Z]{4} \d{3}', str(DESC))
            COURSE_INFO[COURSE_TITLE].append({
                'prereq' : PRE_REQS,
                'desc' : course.find_next('span').text,
                })

            # print(course.find_next('span').text)

        else:
           # print("NA")
            COURSE_INFO[COURSE_TITLE].append({
                'prereq' : 'NA',
                'desc' : 'NA',
                })


with open('courses.txt', 'w') as outfile:
    json.dump(COURSE_INFO, outfile)
