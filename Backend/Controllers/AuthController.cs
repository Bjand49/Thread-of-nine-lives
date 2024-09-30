﻿using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Services;
using Domain.Entities;

namespace Backend.Controllers
{
    public static class AuthController
    {
        public static void MapAuthEndpoints(this WebApplication app)
        {
            // Login Endpoint
            app.MapPost("/auth/login", (IUserService userService, User user) =>
            {
                // Check if user exists and password is correct
                if (userService.ValidateUserCredentials(user.Username, user.PasswordHash))
                {
                    // Create claims (you can add roles or other claims here)
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };

                    // Generate the JWT token
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("A7c$7DFG9!fQ2@Vbn#4gTxlpT67^n8#QhE"));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        issuer: "threadgame",
                        audience: "threadgame",
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(30),
                        signingCredentials: creds);

                    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                    // Return the token
                    return Results.Ok(new { token = tokenString });
                }

                // If user is not valid
                return Results.Unauthorized();
            });

            // Signup (Create User) Endpoint
            app.MapPost("/auth/signup", (IUserService userService, User user) =>
            {
                // Check if user already exists
                var existingUser = userService.GetUserByUsername(user.Username);
                if (existingUser != null)
                {
                    return Results.BadRequest("User already exists");
                }

                // Create new user
                var newUser = new User
                {
                    Username = user.Username,
                    PasswordHash = user.PasswordHash // Password will be hashed in the service
                };

                userService.CreateUser(newUser);

                return Results.Ok("User created successfully");
            });
        }
    }
}
