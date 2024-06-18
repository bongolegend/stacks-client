import os

def create_master_file(directory, master_file):
    if os.path.exists(master_file):
        os.remove(master_file)
    with open(master_file, 'w') as master:
        for file in os.listdir(directory):
            file_path = os.path.join(directory, file)
            if file_path.endswith(('.ts', '.tsx')) and os.path.isfile(file_path):
                with open(file_path, 'r') as f:
                    master.write(f"// Filename: {file}\n")
                    print(f"Starting Filename: {file}")
                    master.write(f.read())
                    master.write("\n\n")  # Add new lines between files for readability
                    print(f"Finished Filename: {file}")

directory = '/Users/nico/code/stacks-client'  # Replace with the path to your directory
master_file = f'{directory}/master_file.txt'  # Replace with the path to your master file

create_master_file(directory, master_file)
