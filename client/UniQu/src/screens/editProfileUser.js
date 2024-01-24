import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { EditUser, WHO_AM_I_USER } from "../queries/query";
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
  const { loading, error, data } = useQuery(WHO_AM_I_USER);
  const [editProfileMutation] = useMutation(EditUser);
  const [tagsValue, setTagsValue] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    imgUrl: "",
    password: "",
    tags: [],
    userLocations: "",
  });

  //ME WANT SLEEP MORE

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(formData.tags);

  const [items, setItems] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState("");

  const onInputHandler = () => {
    const updatedProfile = {
      name: formData.name,
      password: formData.password,
      tags: tagsValue,
      userLocations: selectedLoc,
      imgUrl: formData.imgUrl,
    };
    console.log(updatedProfile, "anjgg");

    editProfileMutation({
      variables: {
        editUser: updatedProfile,
      },
    })
      .then((response) => {
        console.log("Response from mutation:", response);

        if (response && response.data && response.data.editProfile) {
          console.log("Successfully updated user:", response.data.editProfile);

          const editedUser = response.data.editProfile;
          setFormData({
            ...formData,
            name: editedUser.name,
            imgUrl: editedUser.imgUrl,
            password: editedUser.password,
            tags: editedUser.tags,
            userLocations: editedUser.userLocations,
          });
          navigation.navigate("Profile");
        } else {
          console.error("Failed to update user. Response:", response);
        }
      })
      .catch((error) => {
        console.error("Error during mutation:", error);
      });
  };

  useEffect(() => {
    if (!loading && data && data.whoAmI) {
      const { name, imgUrl, password, tags, userLocations } = data.whoAmI;
      setFormData({
        name,
        imgUrl,
        password,
        tags,
        userLocations,
      });

      // Pindahkan baris ini ke sini
      setTagsValue(tags);
    }
  }, [loading, data]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleUpdateProfile = async () => {
  //   try {
  //     await updateProfile({
  //       variables: { input: formData },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.cardEdit}>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.textStyle}> Photo Profile </Text>
        </View>
        <View style={styles.textInput}>
          <TextInput
            style={{ fontSize: 20, marginTop: 5 }}
            value={formData.imgUrl}
            onChangeText={(text) => handleInputChange("imgUrl", text)}
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
            value={formData.name || ""}
            onChangeText={(text) => handleInputChange("name", text)}
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
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
            secureTextEntry={true}
            keyboardType="default"
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
            items={tags.map((tag) => ({ label: tag, value: tag }))}
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
          <Text style={{ ...styles.textStyle, marginTop: 15, marginLeft: 10 }}>
            {" "}
            Location{" "}
          </Text>
        </View>
        <View style={styles.pickerInput}>
          <SelectList
            setSelected={(val) => setSelectedLoc(val)}
            data={location}
            save="value"
            defaultValue={formData.userLocations}
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
    marginLeft: 10,
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
