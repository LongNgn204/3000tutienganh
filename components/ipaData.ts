export interface Phoneme {
    symbol: string;
    type: 'vowel' | 'consonant';
    examples: { word: string, ipa: string }[];
}

export const IPA_DATA: Phoneme[] = [
    // Vowels
    { symbol: 'iː', type: 'vowel', examples: [{ word: 'sheep', ipa: '/ʃiːp/' }, { word: 'see', ipa: '/siː/' }, { word: 'key', ipa: '/kiː/' }] },
    { symbol: 'ɪ', type: 'vowel', examples: [{ word: 'ship', ipa: '/ʃɪp/' }, { word: 'it', ipa: '/ɪt/' }, { word: 'sit', ipa: '/sɪt/' }] },
    { symbol: 'ʊ', type: 'vowel', examples: [{ word: 'good', ipa: '/ɡʊd/' }, { word: 'book', ipa: '/bʊk/' }, { word: 'put', ipa: '/pʊt/' }] },
    { symbol: 'uː', type: 'vowel', examples: [{ word: 'shoot', ipa: '/ʃuːt/' }, { word: 'blue', ipa: '/bluː/' }, { word: 'food', ipa: '/fuːd/' }] },
    { symbol: 'e', type: 'vowel', examples: [{ word: 'bed', ipa: '/bed/' }, { word: 'head', ipa: '/hed/' }, { word: 'many', ipa: '/ˈmeni/' }] },
    { symbol: 'ə', type: 'vowel', examples: [{ word: 'teacher', ipa: '/ˈtiːtʃər/' }, { word: 'about', ipa: '/əˈbaʊt/' }, { word: 'sofa', ipa: '/ˈsəʊfə/' }] },
    { symbol: 'ɜː', type: 'vowel', examples: [{ word: 'bird', ipa: '/bɜːrd/' }, { word: 'girl', ipa: '/ɡɜːrl/' }, { word: 'learn', ipa: '/lɜːrn/' }] },
    { symbol: 'ɔː', type: 'vowel', examples: [{ word: 'door', ipa: '/dɔːr/' }, { word: 'walk', ipa: '/wɔːk/' }, { word: 'four', ipa: '/fɔːr/' }] },
    { symbol: 'æ', type: 'vowel', examples: [{ word: 'cat', ipa: '/kæt/' }, { word: 'black', ipa: '/blæk/' }, { word: 'happy', ipa: '/ˈhæpi/' }] },
    { symbol: 'ʌ', type: 'vowel', examples: [{ word: 'cup', ipa: '/kʌp/' }, { word: 'sun', ipa: '/sʌn/' }, { word: 'money', ipa: '/ˈmʌni/' }] },
    { symbol: 'ɑː', type: 'vowel', examples: [{ word: 'father', ipa: '/ˈfɑːðər/' }, { word: 'car', ipa: '/kɑːr/' }, { word: 'park', ipa: '/pɑːrk/' }] },
    { symbol: 'ɒ', type: 'vowel', examples: [{ word: 'hot', ipa: '/hɒt/' }, { word: 'box', ipa: '/bɒks/' }, { word: 'watch', ipa: '/wɒtʃ/' }] },
    // Diphthongs
    { symbol: 'eɪ', type: 'vowel', examples: [{ word: 'say', ipa: '/seɪ/' }, { word: 'eight', ipa: '/eɪt/' }, { word: 'name', ipa: '/neɪm/' }] },
    { symbol: 'aɪ', type: 'vowel', examples: [{ word: 'my', ipa: '/maɪ/' }, { word: 'five', ipa: '/faɪv/' }, { word: 'time', ipa: '/taɪm/' }] },
    { symbol: 'ɔɪ', type: 'vowel', examples: [{ word: 'boy', ipa: '/bɔɪ/' }, { word: 'noise', ipa: '/nɔɪz/' }, { word: 'coin', ipa: '/kɔɪn/' }] },
    { symbol: 'əʊ', type: 'vowel', examples: [{ word: 'go', ipa: '/ɡəʊ/' }, { word: 'show', ipa: '/ʃəʊ/' }, { word: 'boat', ipa: '/bəʊt/' }] },
    { symbol: 'aʊ', type: 'vowel', examples: [{ word: 'now', ipa: '/naʊ/' }, { word: 'house', ipa: '/haʊs/' }, { word: 'mouse', ipa: '/maʊs/' }] },
    // Consonants
    { symbol: 'p', type: 'consonant', examples: [{ word: 'pen', ipa: '/pen/' }, { word: 'happy', ipa: '/ˈhæpi/' }, { word: 'stop', ipa: '/stɒp/' }] },
    { symbol: 'b', type: 'consonant', examples: [{ word: 'bad', ipa: '/bæd/' }, { word: 'baby', ipa: '/ˈbeɪbi/' }, { word: 'job', ipa: '/dʒɒb/' }] },
    { symbol: 't', type: 'consonant', examples: [{ word: 'tea', ipa: '/tiː/' }, { word: 'little', ipa: '/ˈlɪtl/' }, { word: 'get', ipa: '/ɡet/' }] },
    { symbol: 'd', type: 'consonant', examples: [{ word: 'did', ipa: '/dɪd/' }, { word: 'lady', ipa: '/ˈleɪdi/' }, { word: 'sad', ipa: '/sæd/' }] },
    { symbol: 'k', type: 'consonant', examples: [{ word: 'cat', ipa: '/kæt/' }, { word: 'back', ipa: '/bæk/' }, { word: 'school', ipa: '/skuːl/' }] },
    { symbol: 'ɡ', type: 'consonant', examples: [{ word: 'go', ipa: '/ɡəʊ/' }, { word: 'again', ipa: '/əˈɡen/' }, { word: 'big', ipa: '/bɪɡ/' }] },
    { symbol: 'f', type: 'consonant', examples: [{ word: 'fall', ipa: '/fɔːl/' }, { word: 'coffee', ipa: '/ˈkɒfi/' }, { word: 'if', ipa: '/ɪf/' }] },
    { symbol: 'v', type: 'consonant', examples: [{ word: 'van', ipa: '/væn/' }, { word: 'heavy', ipa: '/ˈhevi/' }, { word: 'have', ipa: '/hæv/' }] },
    { symbol: 'θ', type: 'consonant', examples: [{ word: 'think', ipa: '/θɪŋk/' }, { word: 'healthy', ipa: '/ˈhelθi/' }, { word: 'bath', ipa: '/bɑːθ/' }] },
    { symbol: 'ð', type: 'consonant', examples: [{ word: 'this', ipa: '/ðɪs/' }, { word: 'mother', ipa: '/ˈmʌðər/' }, { word: 'with', ipa: '/wɪð/' }] },
    { symbol: 's', type: 'consonant', examples: [{ word: 'so', ipa: '/səʊ/' }, { word: 'miss', ipa: '/mɪs/' }, { word: 'city', ipa: '/ˈsɪti/' }] },
    { symbol: 'z', type: 'consonant', examples: [{ word: 'zoo', ipa: '/zuː/' }, { word: 'lazy', ipa: '/ˈleɪzi/' }, { word: 'his', ipa: '/hɪz/' }] },
    { symbol: 'ʃ', type: 'consonant', examples: [{ word: 'she', ipa: '/ʃiː/' }, { word: 'sure', ipa: '/ʃʊər/' }, { word: 'fish', ipa: '/fɪʃ/' }] },
    { symbol: 'ʒ', type: 'consonant', examples: [{ word: 'vision', ipa: '/ˈvɪʒn/' }, { word: 'pleasure', ipa: '/ˈpleʒər/' }, { word: 'usual', ipa: '/ˈjuːʒuəl/' }] },
    { symbol: 'h', type: 'consonant', examples: [{ word: 'hat', ipa: '/hæt/' }, { word: 'hello', ipa: '/həˈləʊ/' }, { word: 'who', ipa: '/huː/' }] },
    { symbol: 'm', type: 'consonant', examples: [{ word: 'man', ipa: '/mæn/' }, { word: 'lemon', ipa: '/ˈlemən/' }, { word: 'some', ipa: '/sʌm/' }] },
    { symbol: 'n', type: 'consonant', examples: [{ word: 'no', ipa: '/nəʊ/' }, { word: 'funny', ipa: '/ˈfʌni/' }, { word: 'sun', ipa: '/sʌn/' }] },
    { symbol: 'ŋ', type: 'consonant', examples: [{ word: 'sing', ipa: '/sɪŋ/' }, { word: 'finger', ipa: '/ˈfɪŋɡər/' }, { word: 'thanks', ipa: '/θæŋks/' }] },
    { symbol: 'l', type: 'consonant', examples: [{ word: 'leg', ipa: '/leɡ/' }, { word: 'hello', ipa: '/həˈləʊ/' }, { word: 'all', ipa: '/ɔːl/' }] },
    { symbol: 'r', type: 'consonant', examples: [{ word: 'red', ipa: '/red/' }, { word: 'sorry', ipa: '/ˈsɒri/' }, { word: 'car', ipa: '/kɑːr/' }] },
    { symbol: 'j', type: 'consonant', examples: [{ word: 'yes', ipa: '/jes/' }, { word: 'yellow', ipa: '/ˈjeləʊ/' }, { word: 'new', ipa: '/njuː/' }] },
    { symbol: 'w', type: 'consonant', examples: [{ word: 'wet', ipa: '/wet/' }, { word: 'one', ipa: '/wʌn/' }, { word: 'queen', ipa: '/kwiːn/' }] },
    { symbol: 'tʃ', type: 'consonant', examples: [{ word: 'chin', ipa: '/tʃɪn/' }, { word: 'teacher', ipa: '/ˈtiːtʃər/' }, { word: 'watch', ipa: '/wɒtʃ/' }] },
    { symbol: 'dʒ', type: 'consonant', examples: [{ word: 'jam', ipa: '/dʒæm/' }, { word: 'age', ipa: '/eɪdʒ/' }, { word: 'soldier', ipa: '/ˈsəʊldʒər/' }] },
];