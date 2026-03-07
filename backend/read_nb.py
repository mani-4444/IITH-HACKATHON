import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open("Untitled4.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

with open("nb_output.txt", "w", encoding="utf-8") as out:
    for i, cell in enumerate(nb["cells"]):
        src = "".join(cell["source"])
        out.write(f"=== Cell {i} ({cell['cell_type']}) ===\n")
        out.write(src)
        out.write("\n" + "="*80 + "\n\n")

print("Done. Output written to nb_output.txt")
