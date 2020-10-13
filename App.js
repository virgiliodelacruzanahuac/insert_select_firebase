import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View,Text } from 'react-native';
import firebase from './firebaseDb';
//https://github.com/native-html/table-plugin
// 1.- npm install react-native-community/react-native-webview
// 2.- npm install react-native-render-html 
import HTML from 'react-native-render-html';
import {
  IGNORED_TAGS,
  alterNode,
  makeTableRenderer
} from '@native-html/table-plugin';
import WebView from 'react-native-webview';

var html = ``;

const renderers = {
  table: makeTableRenderer({ WebView })
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
};
class App extends Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection('gatitos');
    this.state = {
      nombre: '',
      raza: '',
      edad: '',
      isLoading: false,
      gatitosArr: [],
    };
  }
  componentDidMount() {
    this.unsubscribe = this.dbRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount(){
    this.unsubscribe();
  }
  
  generalistatablahtml()
  {
    html=``;
    html+=`
    <table>
  <tr>
    <th>Nombre</th>
    <th>Raza</th>
    <th>Edad</th>
  </tr>`;

    this.state.gatitosArr.map((item, i) => {
      html+=`<tr>
      <td>`+ item.nombre +`</td>
      <td>`+ item.raza +`</td>
      <td>`+ item.edad +`</td>
    </tr>`;
     
      
    });
    html+= `</table>`; 
  
  }


  getCollection = (querySnapshot) => {
    const gatitosArr = [];
    querySnapshot.forEach((res) => {
      const { nombre, raza, edad } = res.data();
      gatitosArr.push({
        key: res.id,
        res,
        nombre,
        raza,
        edad,
      });
    });
    this.setState({
      gatitosArr,
      isLoading: false,
   });
 
  
  }
  
  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  guardaGatito() {
    if(this.state.nombre === ''){
     alert('Pon el nombre del gatito!')
    } else {
      this.setState({
        isLoading: true,
      });      
      this.dbRef.add({
        nombre: this.state.nombre,
        raza: this.state.raza,
        edad: this.state.edad,
      }).then((res) => {
        this.setState({
          nombre: '',
          raza: '',
          edad: '',
          isLoading: false,
        });
        alert("Guardado con éxito")
      })
      .catch((err) => {
        console.error("Error- ", err);
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }
    /*inicio armado renglones */
    html=``;
    html+=`
    <table>
  <tr>
    <th>Nombre</th>
    <th>Raza</th>
    <th>Edad</th>
  </tr>`;

    this.state.gatitosArr.map((item, i) => {
      html+=`<tr>
      <td>`+ item.nombre +`</td>
      <td>`+ item.raza +`</td>
      <td>`+ item.edad +`</td>
    </tr>`;
     
      
    });
    html+= `</table>`; 
   /* fin armado renglones */

    return (
      <ScrollView style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Registro Gatitos</Text>
          <TextInput
              placeholder={'Nombre gatito'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'nombre')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Raza gatito'}
              value={this.state.raza}
              onChangeText={(val) => this.inputValueUpdate(val, 'raza')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Edad'}
              value={this.state.edad}
              onChangeText={(val) => this.inputValueUpdate(val, 'edad')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Guarda gatito'
            onPress={() => this.guardaGatito()} 
            color="#19AC52"
          />
        </View>
        <Text>{"\n"}</Text>
        <HTML html={html} {...htmlConfig} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App;
