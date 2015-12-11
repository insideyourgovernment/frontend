import os
os.system('git add .;')
os.system(' git commit -a -m "commit"')
os.system('git push origin master') 
os.system('aws s3 sync . s3://insideyourgovernment.com/ --region us-west-2 --exclude *git* --exclude *sage* --exclude *git*')

