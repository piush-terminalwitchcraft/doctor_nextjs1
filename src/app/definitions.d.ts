declare global{
        interface Window {
                webkitSpeechRecognition: any;
                SpeechRecognition: any;
                confirmationResult: any; 
                recaptchaVerifier: any;
        }
}