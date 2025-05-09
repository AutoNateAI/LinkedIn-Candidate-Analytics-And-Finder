
I want to create a vanilla js + j query + bootstrap dashboard to where I can upload a file like @linkedin_profiles_all.csv and get very smart analytic tools. A tool that is really pertinent for me to have is the ability to do deep filtering on the data set on various columns as well as sorting from descending to ascending and vice versa. some major filters for this are the day in which it was posted, the entry type (like, comment, post, repost). we want to be able to sort. also, we still want to filter on other values that you think may be essential for us to determine who is a software engineer that would be a hot target for an interview at AWS for a software engineering full position. The candidate id exist inside of the input url. that is important for the dashboard you will create.

As we are able to filter and sort, we want to be able to export the data in json format that has been filtered and sorted...the data for each candidate. the data should show as a json list of objects where each object is a candidate/entry from the csv that fits the filter.

This just the start. we will continue to build on this and iterate, therefore develop this in a modular way that we can scale with functionality. Pretty much, use clean coding practices with an emphasis on OOP to structure data flows, models and services as well as ui components.

Also, this dashboard should have a login page that has a user already configured called admin that has the password "goodlucky456". therefore all the processing should be client side, even for the filtering outlined above.

we want this to be optimized for both desktop and mobile, meaning that mobile may have a different overall ui design because of how tables look and filtering look on mobile devices vs desktop devices.

for the desktop, i am imagining after the user signs in that there is an overall dashboard with a side navigation to various other services. the top tab says dashboard which is like the home overview market analysis of the data sheet once uploaded, and there is a tab for uploading the data. once the upload tab is hit, the ui shows the upload modal where we can upload a csv for processing. once the data is loaded, there is a process button that shows that once is clicked runs a deep data analysis with graphs and tables but most importantly allows for a tab for a page where we can see the full table of data and see the filter types with dials and drop downs and text filters for the various for us to do a deep analysis. once we begin to do out deep analysis, we want to be able to export the ones that hit the filter as json.

now for mobile, make this happen as well, but in a clean mobile optimized way. make sure to use flexbox and bootstrap to help with the responsive design. 

make sure that there is a logout, and the login info is saved in the browser cache once logged successfullly and removed when the click of the logout. 

make it a floating card design and please again focus on responsiveness.