import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { AppBar, Avatar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Modal from 'react-native-modal';
import numeral from 'numeral';


const Crud = () => {
  const [arr, setArr] = useState([]);
  let host = '192.168.137.224:5000';

  const [id, setId] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState({
    nom: '',
    salaire: '',
  });

  const handleChange = (inputName, value) => {
    setEmployeeInfo((prevEmployee) => ({
      ...prevEmployee,
      [inputName]: value,
    }));
  };

  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);

  const [employeeNewInfo, setEmployeeNewInfo] = useState({
    name: '',
    salaire: '',
  });

  const handleChange2 = (inputName, value) => {
    setEmployeeNewInfo((prevEmployee) => ({
      ...prevEmployee,
      [inputName]: value,
    }));
  };

  const openDialog = () => {
    setIsVisible(true);
  };

  const closeDialog = () => {
    setIsVisible(false);
  };

  const openDialog2 = () => {
    setIsVisible2(true);
  };

  const closeDialog2 = () => {
    setIsVisible2(false);
  };

  const openDialog3 = () => {
    setIsVisible3(true);
  };

  const closeDialog3 = () => {
    setIsVisible3(false);
  };

  const listE = async () => {
    try {
      const response = await axios.get(`http://${host}/listEmployees`);
      const data = response.data;
      setArr(data.map((item) => ({ ...item, menuVisible: false }))); // Set initial menuVisible value to false for each item
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };

  const [salaires, setSalaires] = useState({
    min: '',
    max: '',
  });

  const getSalaires = async () => {
    const response = await axios.get(`http://${host}/getSalaire`);
    setSalaires({
      min: response.data[0].min,
      max: response.data[0].max,
    });
    Alert.alert("info",response.data[0].min)
  };

  const deleteE = async () => {
    const id = id

    //const response = await axios.delete(`http://${host}/delEmployee/${id}`);
    Alert.alert('Info', id);
    //listE();
    //getSalaires();
  };

  useEffect(() => {
    listE();
    getSalaires();
  }, []);

  const insertE = async () => {
    const response = await axios.post(`http://${host}/inEmployee`, employeeInfo);
    Alert.alert('Info', response.data);
    listE();
    getSalaires();
    setIsVisible(false);
    setEmployeeInfo({ nom: '', salaire: '' });
  };

  const getEmData = async (id) => {
    setId(id);
    const response = await axios.get(`http://${host}/getEmployee/${id}`);
    const nameData = response.data[0].nom_employee;
    const salaireData = response.data[0].salaire_employee;
    setEmployeeNewInfo(() => ({
      name: nameData,
      salaire: salaireData,
    }));
  };

  const modifyE = async () => {
    const newInfo = {
      newName: employeeNewInfo.name,
      newSalaire: employeeNewInfo.salaire,
      id: id,
    };
    const response = await axios.post(`http://${host}/modEmployee`, newInfo);
    Alert.alert('Info', response.data);
    closeDialog2();
    listE();
    getSalaires();
  };

  const toggleMenu = (index) => {
    setArr((prevArr) => {
      const updatedArr = prevArr.map((item, i) => {
        if (i === index) {
          return { ...item, menuVisible: !item.menuVisible };
        } else {
          return { ...item, menuVisible: false };
        }
      });
      return updatedArr;
    });
  };


  return (
    <>
      <View>
        <AppBar
          title="Kely Saina"
          color="#123456"
          trailing={props => (
            <Icon
              name="refresh"
              onPress={() => {
                listE();
                getSalaires();
              }}
              size={22}
              color="white"
              style={{ marginRight: 15 }}
            />
          )}
        />
        <ScrollView style={{ padding: 5, height: 650 }}>
          {arr.map((a, index) => (
            <View
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                margin: 5,
              }}
            >
              <Avatar label={a.nom_employee} color="#123456" style={{ marginRight: 12 }} />
              <View
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  width: '75%',
                  height: 80,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{a.nom_employee}</Text>
                <Text style={{ fontSize: 18, color: 'gray' }}>{a.salaire_employee.toString()} Ar</Text>

              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  width: '20%',
                }}
              >
                {a.menuVisible && (
                  <View
                    key={index}
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      right: 75,
                      width: 150,
                      backgroundColor: '#123456',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        openDialog2();
                        getEmData(a.id_employee);
                        toggleMenu(index);
                      }}
                      style={{ padding: 10, color: '#ffffff' }}
                    >
                      <Text style={{ color: '#ffffff' }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        openDialog3()
                        setId(a.id_employee)
                        toggleMenu(index);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text style={{ color: '#ffffff' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity onPress={() => toggleMenu(index)} style={{ width: 60, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="ellipsis-v" size={24} style={{ marginRight: 25 }} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal isVisible={isVisible}>
          <View style={{ backgroundColor: 'white', padding: 16 }}>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}>Add employee's salary</Text>
              <Icon name="times" size={30} onPress={closeDialog} />
            </View>

            <Text style={{ fontSize: 16, marginBottom: 8 }}>Name</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 16 }}
              onChangeText={(value) => handleChange('nom', value)}
              value={employeeInfo.nom}
            />
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Salary</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 16 }}
              onChangeText={(value) => handleChange('salaire', value)}
              value={employeeInfo.salaire}
            />

            <TouchableOpacity style={{ backgroundColor: 'blue', padding: 8, borderRadius: 4 }} onPress={insertE}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={isVisible2}>
          <View style={{ backgroundColor: 'white', padding: 16 }}>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}>Edit employee's salary</Text>
              <Icon name="times" size={30} onPress={closeDialog2} />
            </View>

            <Text style={{ fontSize: 16, marginBottom: 8 }}>Name</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 16 }}
              onChangeText={(value) => handleChange2('name', value)}
              value={employeeNewInfo.name}
            />
            <Text style={{ fontSize: 16, marginBottom: 8 }}>Salary</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'gray', padding: 8, marginBottom: 16 }}
              onChangeText={(value) => handleChange2('salaire', value)}
              value={employeeNewInfo.salaire.toString()}
            />

            <TouchableOpacity style={{ backgroundColor: 'blue', padding: 8, borderRadius: 4 }} onPress={modifyE}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={isVisible3}>
          <View style={{ backgroundColor: 'white', padding: 16 }}>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}>Delete employee's salary data</Text>
              <Icon name="times" size={30} onPress={closeDialog3} />
            </View>

            <Text style={{fontSize:17, margin:10}} >Are you sure you want to delete this record?</Text>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
              <TouchableOpacity style={{ backgroundColor: 'green', padding: 8, borderRadius: 4 }} onPress={deleteE}>
                <Text style={{ color: 'white', textAlign: 'center', width:100 }} >Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: 'red', padding: 8, borderRadius: 4 }} onPress={closeDialog3} >
                <Text style={{ color: 'white', textAlign: 'center', width:100 }}>No</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </Modal>
      </View>

      <View style={{ position: 'absolute', bottom: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ display: 'flex', width: '83%' }}>
          <Text style={{ marginLeft: 7, fontSize: 17, fontWeight: 'bold' }}>Minimal: {salaires.min.toString() ? salaires.min : '0'} Ar</Text>
          <Text style={{ marginLeft: 7, fontSize: 17, fontWeight: 'bold' }}>Maximal: {salaires.max.toString() ? salaires.max : '0'} Ar</Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ backgroundColor: '#123456', padding: 8, borderRadius: 30, width: 60, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onPress={openDialog}
          >
            <Icon name="plus" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Crud;
