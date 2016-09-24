# coding: utf-8

import codecs
import hashlib

# jawiki-latest-all-titles-in-ns0 はでかいから自分でとってきてね
# http://dumps.wikimedia.org/jawiki/latest/
# 項目数に応じて以下を修正する必要あり

# wikipedia項目数
# n = 1146585
n = 1642452
# 用意するビット数（項目数の24倍）
# m = 27518040
m = 39418848
# 用意するhash関数の数（都合上 kの最大数は16）
k = 15
# n,m,k の関係についてはここらへん参照
# http://pages.cs.wisc.edu/~cao/papers/summary-cache/node8.html

# m/24 個の配列を用意（一要素3byte、24bit、最大値 0xFFFFFF）
listnum = m / 24
bloomfilter = list(range(int(listnum)))
# 空要素にアクセスするとエラーになるぽいので、ちょっとアレだけど、最初にすべての要素に 0 を入れておく
for i in bloomfilter:
	bloomfilter[i] = 0

# 配列の一要素をbase64変換
def toBase64 (hex):
	b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	# 6bitずつ切り出して変換
	num1 = (hex & 0xFC0000) >> 18
	num2 = (hex & 0x3F000) >> 12
	num3 = (hex & 0xFC0) >> 6
	num4 = hex & 0x3F
	
	num1 = b64[num1]
	num2 = b64[num2]
	num3 = b64[num3]
	num4 = b64[num4]
	
	return num1 + num2 + num3 + num4


# ファイル読み込み
for line in codecs.open('jawiki-latest-all-titles-in-ns0', 'r', 'utf-8'):
	# 一行ずつ MD5に変換
	line = line.encode('utf-8')
	line = line.strip()
	md5 = hashlib.md5()
	md5.update(line)
	md5hex = md5.hexdigest()
	
#	out.write(md5hex)
#	out.write("\n")
	
	# MD5から 0～mの範囲の k個の数字を生成
	for i in range(k):
		# md5 から 10桁の文字列を取得し16進数→10進数に変換
		# 16桁でやったら Javascript側で桁溢れした orz
		bfnum16 = md5hex[i:i+10]
		bfnum10 = int(bfnum16, 16)
		bfnum = bfnum10 % m

#		bfnum = "%d" % bfnum10
#		out.write(bfnum16)
#		out.write("\n")
#		out.write(bfnum)
#		out.write("\n")
		
		# k個の数字をリストにマッピング
		bflist1 = bfnum / 24
		bflist2 = bfnum % 24
		
		bin1 = bloomfilter[int(bflist1)]
		bin2 = 1 << bflist2
		
		bloomfilter[int(bflist1)] = bin1 | bin2

# ファイル書き出し
out = open('out.txt', 'w')

for i in bloomfilter:
#	print toBase64(i)
#	out.write("%d" % i)
	out.write(toBase64(i))
#	out.write("\n")

out.close()

