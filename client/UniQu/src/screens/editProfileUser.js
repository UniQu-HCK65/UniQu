import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { EditUser } from "../queries/query";
import { useNavigation } from "@react-navigation/native";

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

const location = [
  "Jakarta Selatan",
  "Jakarta Timur",
  "Jakarta Barat",
  "Jakarta Pusat",
];

export default function EditProfileUser() {
  const navigation = useNavigation();

  const [editProfileMutation] = useMutation(EditUser);

  const [input, setInput] = useState({
    name: "Nell",
    tags: [],
    password: "",
    userLocations: "",
    imgUrl: "",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState("");

  const onInputHandler = () => {
    const updatedProfile = {
      name: input.name,
      password: input.password,
      tags: value,
      userLocations: selectedLoc,
      imgUrl: input.imgUrl,
    };
    console.log("successfully changed", updatedProfile);

    editProfileMutation({
      variables: {
        editUser: updatedProfile,
      },
    })
      .then((response) => {
        console.log("successfully changed", response);
        setInput({
          ...input,
          name: response.data.editProfile.name,
          tags: response.data.editProfile.tags,
          userLocations: response.data.editProfile.userLocations,
          imgUrl: response.data?.editProfile?.imgUrl,
        });

        navigation.navigate('Profile');
      })
      .catch((error) => {
        console.error("Error during update data", error);
      });
  };

  useEffect(() => {
    setInput({
      name: "Nell",
      tags: [],
      userLocations: "Jakarta Selatan",
    });

    setItems(tags.map((tag) => ({ label: tag, value: tag })));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Photo Profile </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput
            style={{ fontSize: 20, marginTop: 5 }}
            value={input.imgUrl}
            onChangeText={(text) => setInput({ ...input, imgUrl: text })}
          />
        </View>
      </View>

      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Name </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput
            style={{ fontSize: 20, marginTop: 5 }}
            value={input.name}
            onChangeText={(text) =>
              setInput((prevInput) => ({ ...prevInput, name: text }))
            }
          />
        </View>
      </View>

      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Password </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput
            style={{ fontSize: 20, marginTop: 5 }}
            value={input.password}
            onChangeText={(text) =>
              setInput((prevInput) => ({ ...prevInput, password: text }))
            }
            secureTextEntry={true}
          />
        </View>
      </View>

      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Tags </Text>
        </View>
        <View style={styles.pickerInput}>
          <DropDownPicker
            dropDownContainerStyle={{ backgroundColor: "#f0f0f0" }}
            style={{ backgroundColor: "#f0f0f0" }}
            dropDownDirection="TOP"
            multiple={true}
            min={0}
            max={18}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            theme="LIGHT"
            // multiple={true}
            mode="BADGE"
            badgeDotColors={[
              "#e76f51",
              "#00b4d8",
              "#e9c46a",
              "#e76f51",
              "#8ac926",
              "#00b4d8",
              "#e9c46a",
            ]}
          />
        </View>
      </View>

      <View style={styles.cardEdit}>
        <View>
          <Text style={styles.textStyle}> Location </Text>
        </View>
        <View style={styles.pickerInput}>
          <SelectList
            setSelected={(val) => setSelectedLoc(val)}
            data={location}
            save="value"
            defaultValue={input.userLocations}
          />
        </View>
      </View>

      <View style={styles.buttonSave}>
        <Button onPress={onInputHandler} title="SAVE" />
      </View>
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
    height: 49,
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
  pickerInput: {
    width: 389,
    height: 40,
    marginLeft: -13,
    marginTop: -1,
    paddingLeft: 18,
    paddingTop: 11,
    borderRadius: 10,
  },
  buttonSave: {
    backgroundColor: "#cee3f5",
    marginTop: 80,
    paddingTop: 3,
    height: 40,
    width: 350,
    marginLeft: 35,
    borderRadius: 15,
  },
});
