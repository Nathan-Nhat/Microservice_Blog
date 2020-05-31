import random

color = ['f44336', 'e91e63', '9c27b0', '673ab7', '3f51b5', '2196f3', '0288d1', '0097a7', '009688', '827717',
         '1b5e20', 'ff6f00', '3e2723', 'bf360c', '37474f']


def get_color():
    index = random.randint(0, 14)
    return color[index]
