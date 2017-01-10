#!/bin/bash -e

CDN=https://cdnjs.cloudflare.com/ajax/libs

JS="react/15.4.1/react                            \
    react/15.4.1/react-dom                        \
    axios/0.15.3/axios                            \
    lodash.js/4.17.3/lodash"

rm -f min.js js css external.min.js external.js bootstrap.css

for js in $JS; do
    curl -f $CDN/$js.min.js >> min.js
    curl -f $CDN/$js.js >> js
    echo >> min.js
    echo >> js
done

mv min.js external.min.js
mv js external.js

CSS="twitter-bootstrap/3.3.7/css/bootstrap.css \
     bootstrap-material-design/4.0.2/bootstrap-material-design.css"

for css in $CSS; do
    curl -f $CDN/$css >> css
    echo >> css
done

mv css bootstrap.css
