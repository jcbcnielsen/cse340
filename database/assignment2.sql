-- Query 1: Add Tony Stark account
INSERT INTO public.account
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: Make Tony Stark an admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Query 3: Delete the Tony Stark account
DELETE FROM public.account
WHERE account_id = 1;

-- Query 4: Update the GM Hummer description to say 'a huge interior'
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Query 5: Select sports cars with an inner join
SELECT inv.inv_make, inv.inv_model, cla.classification_name
FROM public.inventory AS inv
	JOIN public.classification AS cla
	ON inv.classification_id = cla.classification_id
WHERE cla.classification_id = 2;

-- Query 6: Update images and thumbnails to be in the /images/vehicles/ directory
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');