import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const tags = [
  "Sneakers",
  "Wedges",
  "Heels",
  "Purse",
  "Dress",
  "Suits",
  "Coat",
  "Scarf",
  "Winter Padding",
  "Accessories",
  "Earrings",
  "Necklace",
  "Bracelets",
  "Brooch",
  "Luis Vuitton",
  "Gucci",
  "Armani",
  "Rolex",
];

export default function EditProfileUser() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  // useffect => maping tags di set items
  // input dr mutation edit
  // button save => menjalankan fungsi edit user 


  return (
    <View style={styles.container}>
      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Name </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput style={{ fontSize: 20 }}>
            <Text style={styles.inputDetail}>Nell Foster</Text>
          </TextInput>
        </View>
      </View>

      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Username </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput style={{ fontSize: 20 }}>
            <Text style={styles.inputDetail}>nell</Text>
          </TextInput>
        </View>
      </View>

      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Email </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput style={{ fontSize: 20 }}>
            <Text style={styles.inputDetail}>nell@mail.com</Text>
          </TextInput>
        </View>
      </View>

      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    width: 373,
    height: 40,
    marginLeft: 5,
    marginTop: 8,
    paddingLeft: 18,
    paddingTop: 11,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 20,
  },
  cardEdit: {
    margin: 15,
  },
  inputDetail: {
    fontSize: 20,
  },
});
