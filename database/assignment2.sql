-- Insert Tony Stark into account table
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- Update Tony Stark account type to Admin
UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;

-- Delete Tony Stark from account table
DELETE FROM public.account WHERE account_id = 1;

-- Change 'the small interiors' to 'a huge interior' in the inv_description column of the GM Hummer vehicle
UPDATE public.inventory 
SET inv_description = REPLACE (inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

--Make and model from inventory based on vehicle classification of 'Sport'. 
SELECT 
  inv_make, 
  inv_model 
FROM 
  public.inventory 
INNER JOIN 
  public.classification 
ON 
  inventory.classification_id = classification.classification_id
WHERE 
  classification_name = 'Sport';

--Update inv_images and inv_thumbnail file path to include /vehicles/ in between /images/ and car-image.jpg
UPDATE public.inventory 
SET 
  inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'), 
  inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');