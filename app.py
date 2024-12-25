import streamlit as st
from streamlit_lottie import st_lottie
import pickle
import string
from nltk.corpus import stopwords
import nltk
import os
from nltk.stem.porter import PorterStemmer

st.set_page_config(page_title="SMC", layout="wide")

# Set up the path for manually downloaded NLTK data
nltk_data_dir = os.path.join(os.path.dirname(__file__), "nltk_data")
nltk.data.path.append(nltk_data_dir)

# Ensure the directory exists
if not os.path.exists(nltk_data_dir):
    raise FileNotFoundError(f"NLTK data folder not found: {nltk_data_dir}. Please ensure 'punkt' and 'stopwords' are placed correctly.")

ps = PorterStemmer()

# URL for animation
lottie_url = "https://lottie.host/bca2fd02-f316-4777-a2d3-4fba17033373/RG0maEkhLT.json"

def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)  # Tokenize text using punkt from the specified nltk_data path

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    return " ".join(y)

# Load vectorizer and model
tfidf = pickle.load(open('vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))

# Streamlit app layout
st.title("Spam Message Classifier 🛸")

with st.container():
    st.write("---")

    left, right = st.columns(2)
    with left:
        input_sms = st.text_area("Enter the message")
        if st.button('Predict'):

            # 1. preprocessing
            transformed_sms = transform_text(input_sms)

            # 2. vectorization
            vector_input = tfidf.transform([transformed_sms])

            # 3. predicting
            result = model.predict(vector_input)[0]

            # 4. Displaying the prediction
            if result == 1:
                st.header("Spam")
            else:
                st.header("Not Spam")

    with right:
        st_lottie(lottie_url, height=300, key="mail-animation")

