import datetime
import uuid
import base64
import requests
import os
import csv


i = 0
# OpenAI API Key
api_key = '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'
# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

directory_path = "uploads"  #

# Read the coordinates.txt file
coordinates_file = "uploads/coordinates.txt"  ############
x_values = []
y_values = []

with open(coordinates_file, 'r') as file:
    reader = csv.reader(file, delimiter='\t')

    # Iterate over each row in the file
    for row in reader:
        # Ensure the row has at least two columns
        if len(row) >= 2:
            # Ensure the values are not empty strings before converting to float
            if row[-2] != '':
                x_values.append(float(row[-2]))
            if row[-1] != '':
                y_values.append(float(row[-1]))

# Print the extracted vectors
print("X Values:", x_values)
print("Y Values:", y_values)



# Create a new CSV file
csv_file = "results/results_log.csv"
# Open the CSV file in write mode
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)


    # Iterate over each file in the directory
    for filename in os.listdir(directory_path):
        if filename.endswith(('.jpg', '.jpeg', '.png', '.gif')):  # Adjust image extensions as needed
            image_path = os.path.join(directory_path, filename)
            

            # Getting the base64 string
            base64_image = encode_image(image_path)

            # Rest of the code for API request and processing the response
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }

            payload = {
                "model": "gpt-4-turbo",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Carefully analyze the image and determine if there are visible signs of a wildfire, such as smoke, flames, or scorched areas. Respond with a simple 'Yes' if a wildfire is present, or 'No' if there are no signs of a wildfire."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                "max_tokens": 300
            }

            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

            content = response.json()['choices'][0]['message']['content']

            # Rest of the code for processing the response based on the content
            if content == 'Yes':
                # Code for handling 'Yes' response
                writer.writerow([directory_path + "/" + filename, x_values[i], y_values[i]])
                print(f"{filename}: Fire")
            elif content == 'No':
                # Code for handling 'No' response
                print(f"{filename}: No Fire")
                # writer.writerow([filename, 'No Fire'])
            else:
                pass
                # Code for handling other responses
                print(f"{filename}: Undetermined")
                # writer.writerow([filename, 'Undetermined'])

            i += 1





# Create a 'results' folder if it doesn't exist
results_folder = 'results'
if not os.path.exists(results_folder):
    os.makedirs(results_folder)

run_id = uuid.uuid4()
current_time = datetime.datetime.now()
timestamp = current_time.strftime("%Y%m%d_%H%M%S")

# Create an empty file with timestamp as name
file_name = f"{timestamp}.txt"
file_path = os.path.join(results_folder, file_name)
with open(file_path, 'w') as f:
    pass  # This creates an empty file

print(f"Script executed at: {current_time}")
print(f"Unique run ID: {run_id}")
#print(f"Empty file created: {file_path}")
#print("Hello from script.py!")
#print("This is the output of the Python script.")