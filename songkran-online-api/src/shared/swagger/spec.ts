import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Songkran Online API',
			version: '1.0.0',
			description: 'REST API for Songkran Online platform',
		},
		servers: [
			{
				url:
					process.env.NODE_ENV === 'production'
						? 'https://api.songkranonline.com'
						: 'http://localhost:4000',
				description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
			schemas: {
				User: {
					type: 'object',
					properties: {
						id: { type: 'integer', example: 1 },
						email: { type: 'string', nullable: true, example: 'user@example.com' },
						name: { type: 'string', nullable: true, example: 'John Doe' },
						avatar: {
							type: 'string',
							nullable: true,
							example: 'https://example.com/avatar.jpg',
						},
						provider: {
							type: 'string',
							nullable: true,
							enum: ['GOOGLE', 'LINE', 'FACEBOOK'],
							example: 'GOOGLE',
						},
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				Activity: {
					type: 'object',
					properties: {
						id: { type: 'integer', example: 1 },
						name: { type: 'string', example: 'Songkran Water Festival' },
						description: {
							type: 'string',
							nullable: true,
							example: 'Annual Songkran water festival activity',
						},
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				ActivityStats: {
					type: 'object',
					properties: {
						activityId: { type: 'integer', example: 1 },
						participantCount: {
							type: 'integer',
							description: 'Number of users who joined the activity (unique)',
							example: 120,
						},
						accessCount: {
							type: 'integer',
							description:
								'Total number of times the activity was accessed (including anonymous)',
							example: 850,
						},
						uniqueUserAccessCount: {
							type: 'integer',
							description:
								'Number of unique logged-in users who accessed the activity',
							example: 300,
						},
					},
				},
				Error: {
					type: 'object',
					properties: {
						message: { type: 'string', example: 'Something went wrong' },
					},
				},
			},
		},
		tags: [
			{ name: 'Health', description: 'API and service health status' },
			{ name: 'Auth', description: 'OAuth Authentication — Google, LINE, Facebook' },
			{ name: 'Activities', description: 'Activity participation and access logs' },
		],
		paths: {
			'/health': {
				get: {
					tags: ['Health'],
					summary: 'Health check',
					description:
						'Returns API status, uptime, response time, and database connectivity. Returns `503` if the database is unreachable.',
					responses: {
						200: {
							description: 'All services healthy',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											status: { type: 'string', example: 'ok' },
											timestamp: { type: 'string', format: 'date-time' },
											uptime: {
												type: 'integer',
												description: 'Server uptime in seconds',
												example: 3600,
											},
											responseTimeMs: { type: 'integer', example: 12 },
											services: {
												type: 'object',
												properties: {
													database: {
														type: 'object',
														properties: {
															status: {
																type: 'string',
																enum: ['ok', 'error'],
																example: 'ok',
															},
															latencyMs: {
																type: 'integer',
																nullable: true,
																example: 4,
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						503: {
							description: 'One or more services are degraded',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											status: { type: 'string', example: 'degraded' },
											timestamp: { type: 'string', format: 'date-time' },
											uptime: { type: 'integer', example: 3600 },
											responseTimeMs: { type: 'integer', example: 5001 },
											services: {
												type: 'object',
												properties: {
													database: {
														type: 'object',
														properties: {
															status: {
																type: 'string',
																example: 'error',
															},
															latencyMs: {
																type: 'integer',
																nullable: true,
																example: null,
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},

			'/auth/google': {
				get: {
					tags: ['Auth'],
					summary: 'Login with Google',
					description: 'Redirects the user to the Google OAuth consent screen',
					responses: {
						302: { description: 'Redirect to Google' },
					},
				},
			},
			'/auth/google/callback': {
				get: {
					tags: ['Auth'],
					summary: 'Google OAuth callback',
					description:
						'Google redirects here with an authorization code. The server exchanges it for a token and redirects to `CLIENT_URL/auth/callback?token=<jwt>`',
					parameters: [
						{ name: 'code', in: 'query', required: true, schema: { type: 'string' } },
						{ name: 'state', in: 'query', required: true, schema: { type: 'string' } },
					],
					responses: {
						302: { description: 'Redirect to frontend with JWT token' },
					},
				},
			},
			'/auth/line': {
				get: {
					tags: ['Auth'],
					summary: 'Login with LINE',
					description: 'Redirects the user to the LINE OAuth consent screen',
					responses: {
						302: { description: 'Redirect to LINE' },
					},
				},
			},
			'/auth/line/callback': {
				get: {
					tags: ['Auth'],
					summary: 'LINE OAuth callback',
					parameters: [
						{ name: 'code', in: 'query', required: true, schema: { type: 'string' } },
						{ name: 'state', in: 'query', required: true, schema: { type: 'string' } },
					],
					responses: {
						302: { description: 'Redirect to frontend with JWT token' },
					},
				},
			},
			'/auth/facebook': {
				get: {
					tags: ['Auth'],
					summary: 'Login with Facebook',
					description: 'Redirects the user to the Facebook OAuth consent screen',
					responses: {
						302: { description: 'Redirect to Facebook' },
					},
				},
			},
			'/auth/facebook/callback': {
				get: {
					tags: ['Auth'],
					summary: 'Facebook OAuth callback',
					parameters: [
						{ name: 'code', in: 'query', required: true, schema: { type: 'string' } },
						{ name: 'state', in: 'query', required: true, schema: { type: 'string' } },
					],
					responses: {
						302: { description: 'Redirect to frontend with JWT token' },
					},
				},
			},
			'/auth/me': {
				get: {
					tags: ['Auth'],
					summary: 'Get current user',
					security: [{ bearerAuth: [] }],
					responses: {
						200: {
							description: 'Current user profile',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/User' },
								},
							},
						},
						401: {
							description: 'Unauthorized',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Error' },
								},
							},
						},
						404: {
							description: 'User not found',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Error' },
								},
							},
						},
					},
				},
			},

			'/activities': {
				get: {
					tags: ['Activities'],
					summary: 'List all activities',
					responses: {
						200: {
							description: 'Array of activities',
							content: {
								'application/json': {
									schema: {
										type: 'array',
										items: { $ref: '#/components/schemas/Activity' },
									},
								},
							},
						},
					},
				},
			},
			'/activities/{id}': {
				get: {
					tags: ['Activities'],
					summary: 'Get activity by ID',
					description:
						'Fetches the activity and **automatically logs an access record**. Include a Bearer token to associate the log with a user.',
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: 'id',
							in: 'path',
							required: true,
							schema: { type: 'integer' },
							description: 'Activity ID',
						},
					],
					responses: {
						200: {
							description: 'Activity details',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Activity' },
								},
							},
						},
						404: {
							description: 'Activity not found',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Error' },
								},
							},
						},
					},
				},
			},
			'/activities/{id}/join': {
				post: {
					tags: ['Activities'],
					summary: 'Join an activity',
					description:
						'Records the user as a participant. Idempotent — joining twice returns success without error.',
					security: [{ bearerAuth: [] }],
					parameters: [
						{
							name: 'id',
							in: 'path',
							required: true,
							schema: { type: 'integer' },
							description: 'Activity ID',
						},
					],
					responses: {
						200: {
							description: 'Joined successfully or already joined',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											message: {
												type: 'string',
												example: 'Joined successfully',
											},
											joined: { type: 'boolean', example: true },
										},
									},
								},
							},
						},
						401: {
							description: 'Unauthorized — login required',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Error' },
								},
							},
						},
						404: {
							description: 'Activity not found',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Error' },
								},
							},
						},
					},
				},
			},
			'/activities/{id}/stats': {
				get: {
					tags: ['Activities'],
					summary: 'Get activity statistics',
					description:
						'Returns participant count, total access count, and unique user access count.',
					parameters: [
						{
							name: 'id',
							in: 'path',
							required: true,
							schema: { type: 'integer' },
							description: 'Activity ID',
						},
					],
					responses: {
						200: {
							description: 'Activity statistics',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ActivityStats' },
								},
							},
						},
						404: {
							description: 'Activity not found',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/Error' },
								},
							},
						},
					},
				},
			},
		},
	},
	apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
