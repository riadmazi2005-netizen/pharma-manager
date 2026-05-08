import json

file_path = "fixtures/initial_data.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

fields_to_scale = ["prix_achat", "prix_vente", "total_ttc", "prix_unitaire", "sous_total"]

for item in data:
    fields = item.get("fields", {})
    for field in fields_to_scale:
        if field in fields and fields[field] is not None:
            value = float(fields[field])
            # Scale by 10
            scaled_value = value * 10
            fields[field] = f"{scaled_value:.2f}"

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Fixtures mises à jour avec succès.")
