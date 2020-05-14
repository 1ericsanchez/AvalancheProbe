#!/usr/bin/env python3

import os
import os.path
from os import path
import time
import re

# This script scrapes snowpilot.org and downloads snowpit xml data
# and corresponding png images. This requires the 'pngquant' binary
# be installed on the system for compressing png images
# (e.g. on osx, 'brew install pngquant')

# delay in seconds between downloads so as to not overload the server
SLEEP = 1
# pits earlier than this are mostly practice/broken
START = 185
URL = "https://snowpilot.org"
ERRS = ["Access denied", "Page not found", "could not be found."]

def init():
    os.makedirs("html", exist_ok=True)
    os.makedirs("png", exist_ok=True)
    os.makedirs("png-fs8", exist_ok=True)
    os.makedirs("xml", exist_ok=True)

def get_start():
    try:
        a = int(sorted([int(fname.split('.')[0]) for fname in os.listdir('png')])[-1])
    except:
        a = 5
    try:
        b = int(sorted([int(fname.split('.')[0]) for fname in os.listdir('xml')])[-1])
    except:
        b = 5
    return max(min(a,b), START) - 1

def get_stop():
    os.system("curl -s " + URL + "/snowpits/query -o ./html/snowpilot.html")
    with open("./html/snowpilot.html", "r") as f:
        for line in f:
            if (line.find("/node/") > 0) and (line.find('a href') > 0):
                return(int(line.rstrip().split('node/')[1].split('"')[0].split('?')[0]))
    return 0

def download(n, ext):
    link = URL + "/snowpit/" + str(n) + "/download/" + ext
    os.system("curl -s -l " + link + " -o " + ext + "/" + str(n) + "." + ext)

def purge(n):
    try: 
        with open("./xml/" + str(n) + ".xml", "r") as f:
            for line in f:
                for e in ERRS:
                    if (e in line): return 1
    except:
        return 0
    return 0

def quantize(i):
    pngfile1 = "png/" + str(i) + ".png"
    pngfile2 = "png-fs8/" + str(i) + "-fs8.png"
    pngfile3 = "png/" + str(i) + "-fs8.png"
    if (path.exists(pngfile1) and not path.exists(pngfile2)):
        print("quantize " + str(i))
        os.system("pngquant " + pngfile1 + " &&  mv " + pngfile3 + " " + pngfile2)

def main():
    stop = get_stop()
    start = get_start()
    print("start: " + str(start) +  ", stop: " + str(stop))
    if (stop <= start):
        print("nothing to do")
    else:
        print("start getting new snowpits")
        for i in range(start, stop):
            time.sleep(SLEEP)
            download(i, 'xml')
            if (purge(i) == 1):
                os.remove("xml/" + str(i) + ".xml")
                continue
            download(i, 'png')
            quantize(i)
    print("Finished Successfully!")

init()
main()
