import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../models/user';
import { Role } from '../models/role';

const users: any[] = [
  {
    id: 1,
    img: 'assets/images/user/admin.jpg',
    email: 'admin@school.org',
    password: 'admin@123',
    firstName: 'Sarah',
    lastName: 'Smith',
    token: 'admin-token',
  },
  {
    id: 2,
    img: 'assets/images/user/Instructor.jpg',
    email: 'Instructor@school.org',
    password: 'Instructor@123',
    firstName: 'Ashton',
    lastName: 'Cox',
    token: 'Instructor-token',
  },
  {
    id: 3,
    img: 'assets/images/user/student.jpg',
    email: 'student@school.org',
    password: 'student@123',
    firstName: 'Ashton',
    lastName: 'Cox',
    token: 'student-token',
  },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(handleRoute));

    function handleRoute() {
      switch (true) {
        case url.endsWith('/authenticate') && method === 'POST':
          return authenticate();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { email, password } = body;
      const user = users.find(
        (x) => x.email === email && x.password === password
      );
      if (!user) {
        return error('email or password is incorrect');
      }
      return ok({
        id: user.id,
        img: user.img,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: user.token,
      });
    }

    // helper functions

    function ok(body?: {
      id: number;
      img: string;
      email: string;
      firstName: string;
      lastName: string;
      role: Role;
      token: string;
    }) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
