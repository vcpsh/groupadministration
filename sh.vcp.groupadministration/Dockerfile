FROM microsoft/aspnetcore:2.0 AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
COPY sh.vcp.gruppenverwaltung.sln ./
COPY sh.vcp.groupadministration/sh.vcp.groupadministration.csproj sh.vcp.groupadministration/
COPY ../sh.vcp.sso/sh.vcp.identity/sh.vcp.identity.csproj ../sh.vcp.sso/sh.vcp.identity/
COPY ../sh.vcp.sso/sh.vcp.ldap/sh.vcp.ldap.csproj ../sh.vcp.sso/sh.vcp.ldap/
COPY DAL/DAL.csproj DAL/
COPY LdapIdentity/LdapIdentity.csproj LdapIdentity/
COPY sh.vcp.groupadministration.dal/sh.vcp.groupadministration.dal.csproj sh.vcp.groupadministration.dal/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/sh.vcp.groupadministration
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "sh.vcp.groupadministration.dll"]
