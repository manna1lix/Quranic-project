// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage(); // Firebase Storage reference
const db = firebase.firestore(); // Firestore reference

let mediaRecorder;
let chunks = [];
let recordedBlob = null;

// Access DOM elements
const recordBtn = document.getElementById('recordBtn');
const audioContainer = document.getElementById('audioContainer');

// Event listener for record button click
recordBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      recordBtn.textContent = 'تسجيل صوت';
      saveRecording(); // Save the recording after stopping
  } else {
      chunks = [];
      startRecording();
      recordBtn.textContent = 'إيقاف التسجيل';
      setTimeout(stopRecording, 60000); // Stop recording after 1 minute (60000 ms)
  }
});

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => {
              chunks.push(e.data);
          };
          mediaRecorder.onstop = () => {
              recordedBlob = new Blob(chunks, { type: 'audio/webm' });
              const audioURL = URL.createObjectURL(recordedBlob);
              displayAudio(audioURL);
          };
          mediaRecorder.start();
      })
      .catch(err => {
          console.error('خطأ في الوصول إلى الميكروفون:', err);
      });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
  }
}

function displayAudio(url) {
  const audioElement = document.createElement('audio');
  audioElement.controls = true;
  audioElement.src = url;
  audioContainer.innerHTML = ''; // Clear previous recordings
  audioContainer.appendChild(audioElement);
}

async function saveRecording() {
  if (recordedBlob) {
      try {
          const id = generateID();
          const storageRef = storage.ref('recordings/' + id);
          const snapshot = await storageRef.put(recordedBlob);
          const downloadURL = await snapshot.ref.getDownloadURL();

          await db.collection('recordings').doc(id).set({
              id: id,
              timestamp: new Date().toISOString(),
              duration: '1 دقيقة', // Update with actual duration if available
              downloadURL: downloadURL,
              // Add more metadata as needed
          });

          console.log('تم حفظ التسجيل في Firebase Storage و Firestore:', id);
      } catch (error) {
          console.error('خطأ في حفظ التسجيل:', error);
      }
  } else {
      console.error('لا يوجد تسجيل صوتي لحفظه.');
  }
}

function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric ID
}
