const int pinX = A0;
const int pinY = A1;
const int leds [3] = { 2, 3, 4};
const int button = 7;
const int buzzer = 8;
int valueX = 0;
int valueY = 0;
int prevValueX = 0;
int prevValueY = 0;
boolean action = false;
int buttonState;

void setup() {
  // put your setup code here, to run once:
  pinMode(button, INPUT);
  pinMode(pinX, INPUT);
  pinMode(pinY, INPUT); 
  pinMode(buzzer, OUTPUT);
  digitalWrite(button, HIGH);
   

  for(int i=0; i<3; i++){
   pinMode(leds[i], OUTPUT);
  }
   Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:

  if (Serial.available() > 0) {
    receivingData();
  } else {
    sendingData();
  }

}

void receivingData() {

  char firstChar = Serial.read();

  if(firstChar == 'd'){
    Serial.println("hola");
     tone(buzzer, 300);
     delay(400);
     tone(buzzer, 250);
     delay(200);
     noTone(buzzer);
    }

       Serial.flush();
  }

void sendingData(){
  
  buttonState = digitalRead(button);
  valueX = makeValue(analogRead(pinX));
  valueY = makeValue(analogRead(pinY));

 // Serial.println(digitalRead(button));

  if (buttonState == 0 && action == false) {

    
   
    Serial.print('1');
    Serial.print(' ');
    Serial.print(valueX);
    Serial.print(' ');
    Serial.print(valueY);
    Serial.print(' ');
    Serial.println();

      action= true;
   
   for(int i=0; i<3; i++){
    digitalWrite(leds[i], HIGH);
   // digitalWrite(buzzer, HIGH);
   
    }
  
  

  }
  
  if (buttonState == 1) {
    action = false;
   for(int i=0; i<3; i++){
    digitalWrite(leds[i], LOW);
    }
    
  }

  if (valueX != prevValueX || valueY != prevValueY) {
  Serial.print(action);
  Serial.print(' ');
  Serial.print(valueX);
  Serial.print(' ');
  Serial.print(valueY);
  Serial.print(' ');
  Serial.println();
    prevValueX = valueX;
    prevValueY = valueY;
  }

  delay(200);

}


int makeValue (float value) {
  return (value / 1023.00 * 100);
}
