import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class CreateCourseComponent {

  course = {
    name: '',
    image: null as File | null,
    video: null as File | null,
    startDate: '',
    endDate: '',
    duration: '',
    rating: 0,
    mentor: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.course.image = file;
    }
  }
  onVideoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.course.video = file;
    }
  }

  submitCourse() {
    const formData = new FormData();
    formData.append('name', this.course.name);
    formData.append('startDate', this.course.startDate);
    formData.append('endDate', this.course.endDate);
    formData.append('duration', this.course.duration);
    formData.append('rating', this.course.rating.toString());
    formData.append('mentor', this.course.mentor);
  
    // Append image and video files if available
    if (this.course.image) {
      formData.append('image', this.course.image, this.course.image.name);
    }
    if (this.course.video) {
      formData.append('video', this.course.video, this.course.video.name);
    }
  
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });
  
      this.http.post('http://localhost:3000/create-course', formData, { headers })
        .subscribe({
          next: (response) => {
            console.log('Course Created Successfully!', response);
            alert('Course Created Successfully');
            this.router.navigate(['/display-course']);
          },
          error: (error) => {
            console.log('Error creating course', error);
            alert(error.error?.message || 'Error creating course');
          }
        });
    } else {
      alert('You must be logged in to create a course!');
    }
  }
}  