import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';



const {  width: screenWidth, height: screenHeight  } = Dimensions.get('window');

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isFirstRun, setIsFirstRun] = useState(true);
  useEffect(()=>{
    if(isFirstRun)
      {
        console.log('Initial Render');
        Alert.alert(
          'PANUTO',
          `Para sa mga gumagamit ng "Wikang Winasto" na proyekto, mahalagang sundin ang tamang istruktura ng pangungusap:
          SIMUNO-PANDIWA-LAYON.

          Ang "Wikang Winasto" ay naka tuon lamang sa pagwawasto ng mga kamalian sa anyo ng pandiwa sa wikang Filipino.
          `,
          [
            {text: "ISARA", onPress:()=>{setIsFirstRun(false)}}
          ]
        );
      }
  },[isFirstRun]);
  //useDounce to prevent the user for multiple clicks.
  function handletTextToSpeech()
  {
    if(result !== '')
    {
      Speech.speak(result,{
        language: 'fil',
        voiceId: 'com.apple.ttsbundle.fil-compact',
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,  
      });
    }
  }

  async function handleCheck() {
    if(inputText !== '')
    {
      try
      {
        const data = await fetch('http://192.168.43.84:3000/receive_data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({'input_data': inputText})});
        const res = await data.json();
        // console.log(res['returned_data']);
        console.log(res["returned_data"]);
        setResult(res["returned_data"]);

      }
      catch (error)
      {
        console.log(error) 
      }
    }
    else
    {
      console.log('Input Field is empty!');
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wikang Winasto</Text>

      <TextInput 
        value={inputText}
        onChangeText={(text)=>{setInputText(text)}}
        placeholder='Type here...' 
        style={styles.textInput}
        multiline={true}
        textAlignVertical="top"
        paddingHorizontal={10} 
        paddingVertical={10} 
        />

        <TextInput
        value={result}
        placeholder='Result will be displayed here' 
        style={styles.resultContainer}
        textAlignVertical="top"
        paddingHorizontal={10} 
        paddingVertical={10}
        multiline={true}
        editable={false}
        />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCheck}>
          <Text style={styles.checkButton}> Itama </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handletTextToSpeech}>
          <Text style={styles.speechButton}>Bigkasin</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setResult(''); setInputText('')}}>
          <Text style={styles.speechButton}>Burahin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ced9d1',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100
  },
  title:{
    fontSize: 35,
    marginBottom: 20,
  },
  textInput:{
    width: screenWidth * 0.9,
    height: 200,
    borderRadius:10,
    backgroundColor:'white',
    fontSize: 20,
  },
  resultContainer:{
    width: screenWidth * 0.9,
    height: 200,
    borderRadius:10,
    backgroundColor:'white',
    fontSize: 20,
    marginTop: 10,
    color: 'black'
  },
  speechButton:{
    width: screenWidth * 0.25,
    height: 50,
    backgroundColor: 'green',
    textAlign: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderRadius: 20,
    color: 'white',
    fontSize: 15
  },
  checkButton:{
    width: screenWidth * 0.25,
    height: 50,
    backgroundColor: 'green',
    textAlign: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderRadius: 20,
    color: 'white',
    fontSize: 15
  },
  buttonContainer:{
    display: 'flex',
    flexDirection: 'row',
    width: screenWidth * 0.9,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});