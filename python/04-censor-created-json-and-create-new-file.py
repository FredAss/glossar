import json
import re
import os

PATH_TO_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../data/')
PATH_TO_SRC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), '../src/data/')


def main():
    with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-with-categories.json") as infile:
        content = json.load(infile)
        for term in content:
            description_english = term["description-english"]
            term_english = term["term-english"]

            description_german = term["description-german"]
            term_german = term["term-german"]

            censored_desc_english = description_english.split("Notes")[0]\
                                                       .split("Note")[0]\
                                                       .split("Examples")[0]\
                                                       .split("Course note:")[0]

            pattern = re.compile(r"[\w]*%s[\w]*" % term_english, re.IGNORECASE)
            censored_desc_english = pattern.sub("xxx", censored_desc_english)

            censored_desc_german = description_german.split("Anmerkung")[0]\
                                                     .split("Anmerkungen")[0]\
                                                     .split("Beispiele")[0]

            pattern = re.compile(r"[\w]*%s[\w]*" % term_german, re.IGNORECASE)
            censored_desc_german = pattern.sub("xxx", censored_desc_german)

            term["description-english"] = censored_desc_english
            term["description-german"] = censored_desc_german

        # take out all the terms with a descirption of less then 3 words
        # those are just "siehe ..."
        content = [term for term in content if len(term["description-english"].split()) > 3]
        content = [term for term in content if not term["description-english"].startswith("See")]

    with open(PATH_TO_SRC_DATA_FOLDER + "terms-international-censored.json", "w") as outfile:
        json.dump(content, outfile, indent=2, sort_keys=True)

if __name__ == "__main__":
    main()
