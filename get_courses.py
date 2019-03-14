import re
import sys
import json
from collections import defaultdict
import requests
from bs4 import BeautifulSoup

# Check argument
if sys.argv[1] in ['CSCI', 'csci']:
    DEGREE_URL = 'http://catalog.csuchico.edu/viewer/18/CSCI/CSCINONEBS.html'
    DEGREE = 'CSCI'
    DEGREE_COLOR = 'red'

elif sys.argv[1] in ['CINS', 'cins']:
    DEGREE_URL = 'http://catalog.csuchico.edu/viewer/18/CSCI/CINSNONEBS.html'
    DEGREE = 'CINS'
    DEGREE_COLOR = 'blue'

elif sys.argv[1] in ['EECE', 'eece']:
    DEGREE_URL = 'https://catalog.csuchico.edu/viewer/13/ENGR/CMPENONEBS.html'
    DEGREE = 'EECE'
    DEGREE_COLOR = 'green'

else:
    print("YIKES")
    sys.exit()

# query website and return the html to the variable 'page'
DEGREE_PAGE = requests.get(DEGREE_URL)

# parse the html using beautiful soup and store the variable in `soup`
SOUP = BeautifulSoup(DEGREE_PAGE.text, 'html.parser')

# List to store info scraped from page
COURSE_INFO = {}

# Take ut the <div> of the name and get its value
for course in SOUP.find_all('tr'):
    if course.get('class') is not None:
        # print course.contents[0].text.strip() ,
        COURSE_TITLE = course.contents[0].text.strip()
        COURSE_INFO[COURSE_TITLE] = []
        if "coursePrereq" in str(course.find_next('span').get('class')):
            DESC = course.find_next('span').text
            PRE_REQS = re.findall(r'[A-Z]{4} \d{3}\w?', str(DESC))
            COURSE_INFO[COURSE_TITLE].append({
                'prereq' : PRE_REQS,
                'desc': course.find_next('span').find_next('span').text
                })

            # print(course.find_next('span').text)

        else:
           # print("NA")
            COURSE_INFO[COURSE_TITLE].append({
                'prereq' : ['NA'],
                'desc' : course.find_next('span').text
                })

COURSE_TITLE = []
for course in COURSE_INFO:
    COURSE_TITLE.append(str(course))

# Sort courses by level(111, 211, 311, etc..)
COURSE_TITLE = sorted(COURSE_TITLE, key=lambda x: re.sub('[^0-9]+', '', x).lower())


# Create list of children for each course
COURSE_CHILDREN = defaultdict(list)
for course in COURSE_INFO:
    for r in COURSE_INFO[course][0]['prereq']:
        COURSE_CHILDREN[r].append(course)

# Create list of dictionaries to serve as node data
COURSE_NAMES = []
for course in COURSE_TITLE:
    COURSE_NAMES.append({
            'id' : str(course),
            'color': DEGREE_COLOR,
            'description': COURSE_INFO[course][0]['desc']
            })

# Write to file
with open(DEGREE + '.json', 'w') as outfile:
    json.dump(COURSE_NAMES, outfile)

# Create a list of dictionaries to serve as link data
COURSE_LINKS = []
for course in COURSE_TITLE:
    for prereq in COURSE_CHILDREN[course]:
        COURSE_LINKS.append({
            'source' : str(course),
            'target' : str(prereq)
            })
#
#  print(COURSE_LINKS)
with open(DEGREE + '_pre.json', 'w') as outfile:
    json.dump(COURSE_LINKS, outfile)
