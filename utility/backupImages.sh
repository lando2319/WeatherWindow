echo "Backing Up All AI Images"
dest_dir="/Volumes/AI_Backups"

open_ai_source_dir="/Volumes/OpenAI"
open_ai_image_files=$(find $open_ai_source_dir -type f -iname "*.png")

echo "Backing Up OpenAI Images"
cp -n $open_ai_image_files "$dest_dir/OpenAI"
echo "Backed Up OpenAI Images"

sd_source_dir="/Volumes/SD_Drive"
sd_image_files=$(find $sd_source_dir -type f -iname "*.jpg")

echo "Backing Up StableDiffusion Images"
cp -n $sd_image_files "$dest_dir/StableDiffusion"
echo "Backed Up StableDiffusion Images"

midjourney_source_dir="/Volumes/Midjourney"
midjourney_image_files=$(find $midjourney_source_dir -type f -iname "*.png")

echo "Backing Up MidJourney Images"
cp -n $midjourney_image_files "$dest_dir/Midjourney"
echo "Backed Up MidJourney Images"

echo "Completed All Backups"



