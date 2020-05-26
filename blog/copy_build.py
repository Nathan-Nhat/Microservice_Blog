import os

os.system(f'rm -rf ../front_end_production/build')
os.system(f'cp -a ./build ../front_end_production')