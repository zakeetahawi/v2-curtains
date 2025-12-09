export const EgyptLocations = {
    "Cairo": ["Nasr City", "Maadi", "Heliopolis", "New Cairo", "Zamalek", "Downtown", "Shoubra", "Helwan", "Mokattam"],
    "Giza": ["6th of October", "Sheikh Zayed", "Mohandessin", "Dokki", "Haram", "Faisal", "Imbaba"],
    "Alexandria": ["Smouha", "Miami", "Montaza", "Sidi Gaber", "Roushdy", "Stanley", "Agami", "Borg El Arab"],
    "Dakahlia": ["Mansoura", "Talkha", "Mit Ghamr", "Dekernes", "Aga"],
    "Red Sea": ["Hurghada", "Marsa Alam", "El Gouna", "Safaga", "Ras Gharib"],
    "Beheira": ["Damanhour", "Kafr El Dawar", "Rashid", "Kom Hamada"],
    "Fayoum": ["Fayoum City", "Tamiya", "Sinnuris", "Ibsheway"],
    "Gharbia": ["Tanta", "Mahalla Al Kubra", "Zifta", "Kafr El Zayat"],
    "Ismailia": ["Ismailia City", "Fayed", "Qantara"],
    "Monufia": ["Shibin El Kom", "Menouf", "Ashmoun", "Sadat City"],
    "Minya": ["Minya City", "Mallawi", "Samalut", "Beni Mazar"],
    "Qalyubia": ["Banha", "Shoubra El Kheima", "Qalyub", "Khanka"],
    "New Valley": ["Kharga", "Dakhla", "Farafra"],
    "Suez": ["Suez City", "Arbaeen"],
    "Aswan": ["Aswan City", "Edfu", "Kom Ombo"],
    "Assiut": ["Assiut City", "Dairut", "Manfalut"],
    "Beni Suef": ["Beni Suef City", "Al Wasta", "Nasser"],
    "Port Said": ["Port Said City", "Port Fouad"],
    "Damietta": ["Damietta City", "Ras El Bar", "New Damietta"],
    "Sharkia": ["Zagazig", "10th of Ramadan", "Bilbeis", "Minya El Qamh"],
    "South Sinai": ["Sharm El Sheikh", "Dahab", "Nuweiba", "Saint Catherine"],
    "Kafr El Sheikh": ["Kafr El Sheikh City", "Desouk", "Baltim"],
    "Matrouh": ["Marsa Matrouh", "El Alamein", "Siwa"],
    "Luxor": ["Luxor City", "Esna", "Armant"],
    "Qena": ["Qena City", "Nag Hammadi", "Qus"],
    "North Sinai": ["Arish", "Sheikh Zuweid"],
    "Sohag": ["Sohag City", "Akhmim", "Girga"]
};

export const getGovernorates = () => Object.keys(EgyptLocations).sort();

export const getCities = (governorate) => {
    return EgyptLocations[governorate] ? EgyptLocations[governorate].sort() : [];
};
