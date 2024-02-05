# check_file_exists.py
import json
import sys
import os

file_path = sys.argv[1]
exists = os.path.isfile(file_path)
print(json.dumps({"exists": str(exists).lower()}))