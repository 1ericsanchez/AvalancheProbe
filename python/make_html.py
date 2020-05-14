#!/usr/bin/env python3
import folium
import json
import xml.etree.ElementTree as ET
from os import path
# This script creates an html page with snowpit profiles.
# xml and png-fs8 subdirectories must exist, and also the folium python
# package must be installed.

m = folium.Map(location=[41,-111.5], zoom_start=8, tiles='Stamen Terrain', prefer_canvas=True)
# TODO get correct range of snowpit IDs
for i in range(1,25060):
    xml_in = "xml/" + str(i) + ".xml"
    image = "png-fs8/" + str(i) + "-fs8.png"
    if path.exists(xml_in) and path.exists(image):
        tree = ET.parse(xml_in)
        root = tree.getroot()
        #print(root[0].attrib)
        a = root[0].attrib['lat']
        b = root[0].attrib['longitude']
        color = "grey"
        fill_color = "grey"

        if (a and b):
            lat = float(a)
            lng  = float(b)
            slope = root.attrib['incline']
            stability = root.attrib['stability']
            if (stability):
                if "Poor" in stability:
                    fill_color = "red"
                elif "Fair" in stability:
                    fill_color = "orange"
                elif "Good" in stability:
                    fill_color = "lime"

            #print(root.attrib)
            if (slope):
                if int(slope) >= 35:
                    color = "black"
                elif int(slope) >= 25:
                    color = "blue"
                else: 
                    color = "green"
            html = '<b>#' + str(i) + '</b><img src="' + image + '" width=700px;>'
            popup = folium.Popup(html, max_width=2650)
            folium.CircleMarker([lat, lng], weight=5, radius=8, color=color, fill_color=fill_color, fill_opacity=0.7, popup=popup, max_width=2600).add_to(m)
m.save('cluster.html')
print("saved cluster.html")
