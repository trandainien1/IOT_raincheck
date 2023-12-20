// Include required libraries
#if defined(ESP32)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <DHT.h>  // Include the DHT sensor library

#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2); // Set the LCD address to 0x27 for a 16 chars and 2 line display

#include <Arduino.h>
#include <ArduinoJson.h>

// Define DHT sensor parameters
#define DHTPIN D3
#define DHTTYPE DHT11

// Define motor DC pin
#define MOTORDCPIN D8

// Define Light sensor
#define LIGHTPIN D6

// Define Rain Sensor
#define RAINPIN A0

// Define WiFi credentials
#define WIFI_SSID "OPPO A92"
#define WIFI_PASSWORD "666666666"

// Define Firebase API Key, Project ID, and user credentials
#define API_KEY "AIzaSyDHozyJb46koKOj1xyR7dDvpuuXO2X07z4"
#define FIREBASE_PROJECT_ID "weather-station-iot-2f01e"
#define USER_EMAIL "trandainien1@gmail.com"
#define USER_PASSWORD "abcde123"

// Define Firebase Data object, Firebase authentication, and configuration
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Initialize the DHT sensor
DHT dht(DHTPIN, DHTTYPE);

int counter = 0;

int rainLimit = 800;
int motorPullTime = 3000;

// Push notification
const char* host = "maker.ifttt.com";
const int port = 80;
const char* request = "/trigger/notify_rain/json/with/key/jAU0SgcK-YTK8hJLYgXTtIwNv9ceuyRP3HwPhCD0igQ";

// Send notification
void sendRequest() {
  WiFiClient client;
  while(!client.connect(host, port)) {
    Serial.println("connection fail");
    delay(1000);
  }
  client.print(String("GET ") + request + " HTTP/1.1\r\n"
              + "Host: " + host + "\r\n"
              + "Connection: close\r\n\r\n");
  delay(500);

  while(client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
}

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);

  // initialize MOTOR DC
  pinMode(MOTORDCPIN, OUTPUT);

  // Initialize the DHT sensor
  dht.begin();

  // Set up Light sensor
  pinMode(LIGHTPIN, INPUT);

  // Set up Rain sensor
  pinMode(RAINPIN, INPUT);

  lcd.init();                       // Initialize the LCD
  lcd.backlight();                  // Turn on the backlight
  lcd.clear();                      // Clear the LCD screen

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Print Firebase client version
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  // Assign the API key
  config.api_key = API_KEY;

  // Assign the user sign-in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Assign the callback function for the long-running token generation task
  config.token_status_callback = tokenStatusCallback;  // see addons/TokenHelper.h

  // Begin Firebase with configuration and authentication
  Firebase.begin(&config, &auth);

  // Reconnect to Wi-Fi if necessary
  Firebase.reconnectWiFi(true);

}

void loop() {
  String count = "";

  // -------------- Get rain limit from Firestore  -----------------------
  String pathString = "WebController/810hsIvfih8cn515waHm";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", pathString.c_str(), "")) {
    Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());

    FirebaseJson payload;
    payload.setJsonData(fbdo.payload().c_str());

    // Get the data from FirebaseJson object 
    FirebaseJsonData jsonData;
    payload.get(jsonData, "fields/rainLimit/integerValue", true);
    Serial.println(jsonData.stringValue);

    rainLimit = jsonData.stringValue.toInt();
    Serial.println("Rain limit: ");
    Serial.println(rainLimit);
  }
  else
    Serial.println(fbdo.errorReason());

  // -------------- Get motor pull time from Firestore  -----------------------
  pathString = "WebController/K0aemSyiC5SAJB5Qz6RH";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", pathString.c_str(), "")) {
    Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());

    FirebaseJson payload;
    payload.setJsonData(fbdo.payload().c_str());

    // Get the data from FirebaseJson object 
    FirebaseJsonData jsonData;
    payload.get(jsonData, "fields/motorPullTime/integerValue", true);
    Serial.println(jsonData.stringValue);

    motorPullTime = jsonData.stringValue.toInt() * 1000;
    Serial.println("Motor pull time: ");
    Serial.println(motorPullTime);
  }
  else
    Serial.println(fbdo.errorReason());

  // -------------- Get motorStatus from Firestore to see whether user press the button on the web to activate Motor -----------
  pathString = "WebController/VysXNFiC6Vnwrt1uxs2d";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", pathString.c_str(), "")) {
    Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());

    FirebaseJson payload;
    payload.setJsonData(fbdo.payload().c_str());

    // Get the data from FirebaseJson object 
    FirebaseJsonData jsonData;
    payload.get(jsonData, "fields/motorStatus/booleanValue", true);
    Serial.println(jsonData.stringValue);

    String runMotor = jsonData.stringValue;
    
    if(runMotor == "true"){
      digitalWrite(MOTORDCPIN, 100);
      delay(motorPullTime);
      digitalWrite(MOTORDCPIN, LOW);
      // push notification to phone
      sendRequest();
    }
  }
  else
    Serial.println(fbdo.errorReason());

  pathString = "Count/qGqYRGfZmmlDF7pZlbcr";
  // -------------------------------- get total of documents currently ------------------------
  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", pathString.c_str(), "")) {
    Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());

    FirebaseJson payload;
    payload.setJsonData(fbdo.payload().c_str());

    // Get the data from FirebaseJson object 
    FirebaseJsonData jsonData;
    payload.get(jsonData, "fields/count/integerValue", true);
    Serial.println(jsonData.stringValue);

    count = jsonData.stringValue; 
  }
  else
    Serial.println(fbdo.errorReason());

  // Define the path to the Firestore document
  String documentPath = "EspData/" + count; 

  // Create a FirebaseJson object for storing data
  FirebaseJson content;

  // ------------------ Sensor reading value -------------
  // Read temperature and humidity from the DHT sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Read value from Light sensor
  int light_intensity = digitalRead(LIGHTPIN);

  // Read value from Rain sensor
  float rain = analogRead(RAINPIN);

  // Print temperature, humidity, light values
  Serial.println(temperature);
  Serial.println(humidity);
  Serial.println(light_intensity);
  Serial.println(rain);

  // ------------------------------   LCD Display ---------------------------------------
  lcd.setCursor(0, 0);               // Set the cursor to the first column and first row
  lcd.print("T('C):");
  lcd.print(temperature);
  lcd.print(" H:");
  lcd.print(humidity);
  lcd.setCursor(0,1);
  lcd.print("L:");
  lcd.print(light_intensity);
  lcd.print(" Rain:");
  lcd.print(rain);
  
  // Check if the values are valid (not NaN)
  if (!isnan(temperature) && !isnan(humidity) && !isnan(light_intensity) && !isnan(rain)) {

    // Set the 'Temperature', 'Humidity', 'Rain' and 'Light' fields in the FirebaseJson object
    content.set("fields/Temperature/stringValue", String(temperature, 2));
    content.set("fields/Humidity/stringValue", String(humidity, 2));
    content.set("fields/Light/stringValue", String(light_intensity, 2));
    content.set("fields/Rain/stringValue", String(rain, 2));
    // set id for document
    content.set("fields/id/stringValue", count);

    Serial.print("Update/Add DHT Data... ");

    // Use the patchDocument method to update the Temperature and Humidity Firestore document
    if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), content.raw())) {
      Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
    } else {
        Serial.println(fbdo.errorReason());
    }

    // ----------------------- If rain -> Activate Motor
    if (rain < rainLimit) {
      digitalWrite(MOTORDCPIN, 100);
      delay(motorPullTime);
      digitalWrite(MOTORDCPIN, LOW);
       // ------------ Push notification to Phone ----------------
      sendRequest();
    }
  } else {
    Serial.println("Failed to read data.");
  }

  counter = counter + 1;
  // Delay before the next reading
  
}