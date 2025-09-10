import json
import re
from symspellpy import SymSpell, Verbosity

def load_symspell():
    """Initialize and load the SymSpell dictionary."""
    sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
    sym_spell.load_dictionary("frequency_dictionary_en_82_765.txt",
                              term_index=0, count_index=1, encoding='utf-8-sig')
    return sym_spell

def clean_word(word):
    """Remove punctuation from word but keep track of it."""
    match = re.match(r'^(\w+)([^\w]*)$', word)
    if match:
        return match.group(1), match.group(2)  # word, punctuation
    return word, ""

def check_spelling(sentence):
    """Return corrections in the format [{word: x, suggested: y}, ...]."""
    sym_spell = load_symspell()
    words = sentence.split()
    corrections = []

    for original_word in words:
        clean_word_text, punctuation = clean_word(original_word)

        if len(clean_word_text) <= 1:
            continue

        suggestions = sym_spell.lookup(clean_word_text, Verbosity.CLOSEST, max_edit_distance=2)

        if suggestions:
            best_suggestion = suggestions[0].term
            if best_suggestion.lower() != clean_word_text.lower():
                corrections.append({
                    "word": original_word,  # keep original with punctuation
                    "suggested": best_suggestion + punctuation
                })

    return corrections

if __name__ == "__main__":
    input_sentence = "Thiss is a smple txt writen for cheking the speling corections."
    corrections = check_spelling(input_sentence)
    print(json.dumps(corrections, indent=2))
