sed -i "" -e 's/\.[0-9]=/=/g' .flowconfig
sed -i "" '/[A-z]\.[0-9]\.[A-z]/s/\.[0-9]\./\./' .flowconfig
