export OUTPUT_DIR=dist.$(date +%Y-%m-%d):$(git rev-parse --short HEAD)

npx expo export -p web --output-dir $OUTPUT_DIR

gsutil -m cp -r ~/code/stacks-client/$OUTPUT_DIR/* gs://www.getstacks.io/