# Security Considerations

## 🔴 Critical Security Issues

### 1. Password Storage

**Current State**: Passwords are stored in plain text in localStorage.

**Risk**: If an attacker gains access to the user's browser (via XSS, physical access, or malware), they can easily read all passwords.

**Recommended Solution**:

#### Option A: Use a Proper Password Hashing Library (Recommended)

**Important**: The included `utils/passwordUtils.ts` uses SHA-256 which is **NOT SECURE** for password hashing. It's provided only for educational purposes.

For any real-world use, install and use bcrypt:

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

Then update `services/localStorageService.ts`:
```typescript
import bcrypt from 'bcryptjs';

export const registerUserLocal = async (name: string, password: string) => {
    const users = getUsers();
    if (findUserByNameLocal(name)) {
        return { success: false, message: 'Tên người dùng đã tồn tại.' };
    }
    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: Partial<User> = { 
        name, 
        password: hashedPassword,
        studyProgress: {}, 
        dailyProgress: undefined 
    };
    users.push(newUser as User);
    saveUsers(users);
    return { success: true };
};

export const loginUserLocal = async (name: string, password: string) => {
    const user = findUserByNameLocal(name);
    if (user && await bcrypt.compare(password, user.password)) {
        return { success: true, user };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
};
```

Update function signatures in `services/api.ts` to be async.

#### Option B: Backend Authentication (Recommended for Production)
Move authentication entirely to the backend:

1. Set up a backend server (Node.js + Express, for example)
2. Use bcrypt for password hashing on the server
3. Implement JWT tokens for session management
4. Store tokens in httpOnly cookies (not localStorage)
5. Update `BACKEND_API_URL` in `services/api.ts`

**Note**: The existing code already supports backend API. You just need to:
- Set up a backend server
- Configure `BACKEND_API_URL` in `services/api.ts`

### 2. API Key Exposure

**Current State**: Gemini API key is exposed in client-side code via environment variables.

**Risk**: Anyone can extract your API key from the bundled JavaScript and use it, potentially causing:
- Unauthorized usage charges
- Rate limit exhaustion
- API key revocation

**Recommended Solution**:

#### Create a Backend Proxy
Instead of calling Gemini API directly from the client:

1. Create a backend endpoint:
```javascript
// backend/routes/ai.js
app.post('/api/ai/generate', async (req, res) => {
    const { prompt } = req.body;
    
    // Validate user authentication
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Call Gemini API from backend
    const result = await geminiClient.generate(prompt);
    res.json(result);
});
```

2. Update client code to call your backend instead of Gemini directly

3. Keep GEMINI_API_KEY only on the backend (environment variable or secrets manager)

#### Alternative: Serverless Functions
Use Vercel Functions, Netlify Functions, or AWS Lambda:
- Create serverless function that proxies to Gemini
- Keep API key in function environment
- Call your serverless function from the client

### 3. XSS Protection

**Current State**: Using React which provides some XSS protection by default.

**Recommendations**:
- Never use `dangerouslySetInnerHTML` unless absolutely necessary
- Sanitize user input before storing
- Implement Content Security Policy (CSP) headers
- Use HTTPS only in production

### 4. Data Validation

**Recommendations**:
- Validate all user inputs on both client and server
- Implement rate limiting for API calls
- Add input length limits
- Sanitize data before displaying

## 🟡 Medium Priority

### Session Management
- Current: Uses sessionStorage for auth tokens
- Consider: Implement token expiration and refresh
- Add: Automatic logout after inactivity

### CORS Configuration
If using backend API:
```javascript
// backend/server.js
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true,
    optionsSuccessStatus: 200
}));
```

## 🟢 Best Practices

### Environment Variables
- Never commit `.env.local` to git (already in .gitignore ✓)
- Use different API keys for development and production
- Rotate API keys regularly

### Dependencies
- Run `npm audit` regularly
- Keep dependencies up to date
- Review security advisories for used packages

### Code Review
- Review all code changes for security issues
- Use security linters (ESLint security plugins)
- Consider using tools like Snyk or GitHub Dependabot

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Implement password hashing
- [ ] Move API key to backend
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Implement proper error handling (don't expose sensitive info)
- [ ] Set up monitoring and logging
- [ ] Configure CORS properly
- [ ] Add input validation
- [ ] Review all TODO/FIXME comments
- [ ] Run security audit (`npm audit`)
- [ ] Test authentication flows
- [ ] Implement backup strategy

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)
- [React Security Best Practices](https://react.dev/learn/security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## 🤝 Contributing

If you discover a security vulnerability, please email the maintainer directly instead of opening a public issue.

---

**Last Updated**: October 27, 2025
