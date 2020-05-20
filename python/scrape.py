#!/usr/bin/env python3

# This script scrapes snowpilot.org and downloads snowpit xml data
# and corresponding png images. This requires the 'pngquant' binary
# be installed on the system for compressing png images
# (e.g. on osx, 'brew install pngquant')

import os
import time

# delay in seconds between downloads so as to not overload the server
SLEEP = 0.5

# pits earlier than this are mostly practice/broken
START = 185

URL = "https://snowpilot.org"
ERRS = ["Access denied", "Page not found", "could not be found."]

def my_sys(cmd):
    print(cmd)
    os.system(cmd)

def init():
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
    return max(min(a,b), START)

def get_stop():
    html_file = "snowpilot.html"
    cmd = "curl -s {} /snowpits/query -o {}".format(URL, html_file)
    my_sys(cmd)
    with open(html_file, "r") as f:
        for line in f:
            if (line.find("/node/") > 0) and (line.find('a href') > 0):
                return(int(line.rstrip().split('node/')[1].split('"')[0].split('?')[0]))
    return 0

def download(n, ext):
    link = "{}/snowpit/{}/download/{}".format(URL, n, ext)
    cmd = "curl -s -l {} -o {}/{}.{}".format(link, ext, n, ext)
    my_sys(cmd)

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
    if (os.path.exists(pngfile1) and not os.path.exists(pngfile2)):
        cmd = "pngquant {} && mv {} {}".format(pngfile1, pngfile3, pngfile2)
        my_sys(cmd)

def main():
    stop = get_stop()
    start = get_start()
    print("start: {}, stop: {}".format(start, stop))
    if (start <= stop):
        print("start getting new snowpits")
        for i in range(start, stop):
            time.sleep(SLEEP)
            download(i, 'xml')
            if (purge(i) == 1):
                os.remove("xml/{}.xml".format(i))
                continue
            download(i, 'png')
            quantize(i)
    print("done!")

init()
main()
