import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from "@angular/common/http";

export class PostsInterceptors implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler){{
        const modifiedReq = req.clone({
            headers: req.headers.append('Auth', 'xyz'),
            params: req.params.append('iparams', 'abc')
        })
        return next.handle(modifiedReq);
    }
}
}