
def format(name, rightNow):
  formattedName = name.lower()
  formattedName = formattedName.replace(" ", "-") + "-" + rightNow + ".png"

  return formattedName


finalValue = format("Clear Weather in Chicago", "33-3003")

print(f"{finalValue}")