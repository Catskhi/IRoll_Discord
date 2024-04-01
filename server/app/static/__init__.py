import os

def verify_static_folders():
    if not os.path.exists('app/images'):
        os.mkdir('app/images')

verify_static_folders()