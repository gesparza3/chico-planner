# import libraries
import requests
from bs4 import BeautifulSoup

# specify the url
QUOTE_PAGE = 'http://catalog.csuchico.edu/viewer/search/courses.aspx?cycle=18&subject=CSCI&keywords=&psize=00'

# query website and return the html to the variable 'page'
PAGE = requests.get(QUOTE_PAGE)

# parse the html using beautiful soup and store the variable in `soup`
SOUP = BeautifulSoup(PAGE.text, 'html.parser')

# Take ut the <div> of the name and get its value
for course in SOUP.find_all('tr'):
    if course.get('class') is not None:
        print course.contents[0].text.strip() ,
    elif "coursePrereq" in str(course.find_next('span').get('class')):
        print(course.find_next('span').text)

    else:
        print("NA")
