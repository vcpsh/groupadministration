FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY sh.vcp.groupadministration/sh.vcp.groupadministration.csproj sh.vcp.groupadministration/
COPY ./single-sign-on/sh.vcp.ldap/sh.vcp.ldap.csproj ../single-sign-on/sh.vcp.ldap/
COPY sh.vcp.groupadministration.dal/sh.vcp.groupadministration.dal.csproj sh.vcp.groupadministration.dal/
COPY ./single-sign-on/sh.vcp.identity/sh.vcp.identity.csproj ../single-sign-on/sh.vcp.identity/
RUN dotnet restore sh.vcp.groupadministration/sh.vcp.groupadministration.csproj
COPY . .
WORKDIR /src/sh.vcp.groupadministration
RUN dotnet build sh.vcp.groupadministration.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish sh.vcp.groupadministration.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "sh.vcp.groupadministration.dll"]
