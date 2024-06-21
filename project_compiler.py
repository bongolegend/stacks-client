import os

def append_files_to_master(directory, master, subdir=''):
    path = os.path.join(directory, subdir)
    if os.path.exists(path) and os.path.isdir(path):
        for file in os.listdir(path):
            file_path = os.path.join(path, file)
            if file_path.endswith(('.ts', '.tsx')) and os.path.isfile(file_path):
                relative_path = os.path.relpath(file_path, directory)
                with open(file_path, 'r') as f:
                    master.write(f"// Filename: {relative_path}\n")
                    print(f"Starting Filename: {relative_path}")
                    master.write(f.read())
                    master.write("\n\n")  # Add new lines between files for readability

def create_master_file(directory, master_file):
    specific_folders = ['.', 'components', 'screens', 'navigation', 'utils', 'services', 'contexts', 'types']

    if os.path.exists(master_file):
        os.remove(master_file)

    with open(master_file, 'w') as master:
        # Search in the root directory and specific subdirectories
        for folder in specific_folders:
            append_files_to_master(directory, master, folder)

directory = '/Users/nico/code/stacks-client'  # Replace with the path to your directory
master_file = f'{directory}/master_file.txt'  # Replace with the path to your master file

create_master_file(directory, master_file)
