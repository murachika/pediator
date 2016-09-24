# coding: utf-8

import codecs
import sys
import io

sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# print(sys.getdefaultencoding())
# print(sys.stdout.encoding)

# ファイル書き出し
out = open('out.txt', 'bw')

# ファイル読み込み
for line in codecs.open('ja-pages_current.xml', 'br'):
#	line = line.encode('utf-8')
	line = line.strip()
	if line != b'':
		out.write(line)
		out.write(b'\n')

out.close()
