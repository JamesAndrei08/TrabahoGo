import { collection, addDoc, doc, getDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from './FirebaseConfig';

export async function createJobPosting(employerId, jobData) {
  try {
    
    if (!jobData || !jobData.jobTitle || !jobData.jobDescription || !jobData.address || !jobData.salary) {
      throw new Error('Missing required job fields.');
    }

    // Fetch employer name
    const employerRef = doc(FIRESTORE_DB, 'accounts_employer', employerId);
    const employerSnap = await getDoc(employerRef);

    if (!employerSnap.exists()) {
      throw new Error('Employer does not exist.');
    }

    const employerData = employerSnap.data();
    const employerName = employerData.name || '';

    // Add job posting
    const docRef = await addDoc(collection(FIRESTORE_DB, 'jobPostings'), {
      jobTitle: jobData.jobTitle,
      jobDescription: jobData.jobDescription,
      address: jobData.address,
      salary: jobData.salary,
      employerName: employerName,
      createdAt: serverTimestamp(), 
    });

    console.log('Job posted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw error;
  }
}

export async function getJobPostings() {
  try {
    const q = query(collection(FIRESTORE_DB, 'jobPostings'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });

    return jobs;
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }
}
