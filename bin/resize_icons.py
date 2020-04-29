#!/usr/bin/env python3
import argparse
import os
import cv2


CLASS_SIZES = (16, 32, 128, 256, 512)
CREATE2X = True


def resize(path, class_sizes=CLASS_SIZES, create2x=CREATE2X):
    name, ext = os.path.splitext(os.path.basename(path))
    parent_dir = os.path.dirname(path)

    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    for width in class_sizes:
        sizes = [(width, width), ]
        suffixes = ['@1x', ]
        if create2x:
            sizes.append((width * 2, width * 2))
            suffixes.append('@2x')

        for i in range(len(sizes)):
            sz = sizes[i]
            suffix = suffixes[i]
            new_path = os.path.join(parent_dir, f'{name}{width}{suffix}{ext}')
            new_img = cv2.resize(img, sz, interpolation=cv2.INTER_AREA)
            cv2.imwrite(new_path, new_img)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('image', nargs=1, help='image to resize in PNG format')
    args = parser.parse_args()

    resize(args.image[0])
