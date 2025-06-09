import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const cleanupExpiredJobs = async () => {
  try {
    const now = new Date();
    
    // Get all jobs
    const jobsQuery = query(collection(db, 'jobs'));
    const jobsSnapshot = await getDocs(jobsQuery);
    
    const expiredJobs = [];
    
    jobsSnapshot.docs.forEach((jobDoc) => {
      const jobData = jobDoc.data();
      
      // Check if job has a deadline and if it's passed
      if (jobData.deadline) {
        const deadline = new Date(jobData.deadline.seconds * 1000);
        
        if (deadline < now) {
          expiredJobs.push({
            id: jobDoc.id,
            ...jobData
          });
        }
      }
    });
    
    // Delete expired jobs and their applications
    for (const expiredJob of expiredJobs) {
      console.log(`Deleting expired job: ${expiredJob.title}`);
      
      // Delete all applications for this job
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('jobId', '==', expiredJob.id)
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      
      const deleteApplicationPromises = applicationsSnapshot.docs.map(appDoc => 
        deleteDoc(doc(db, 'applications', appDoc.id))
      );
      
      await Promise.all(deleteApplicationPromises);
      
      // Delete the job
      await deleteDoc(doc(db, 'jobs', expiredJob.id));
    }
    
    console.log(`Cleaned up ${expiredJobs.length} expired jobs`);
    return expiredJobs.length;
  } catch (error) {
    console.error('Error cleaning up expired jobs:', error);
    throw error;
  }
};

// Function to start automatic cleanup (runs every hour)
export const startJobCleanupScheduler = () => {
  // Run cleanup immediately
  cleanupExpiredJobs();
  
  // Then run every hour (3600000 milliseconds)
  setInterval(() => {
    cleanupExpiredJobs();
  }, 3600000);
  
  console.log('Job cleanup scheduler started - will run every hour');
};